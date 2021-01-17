import { User } from "../entities";
import { MyContext } from "src/types";
import {
  Resolver,
  InputType,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() { req, em }: MyContext
  ){
    if (!req.session.userId) {
      return null
    };

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  };
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater then 2",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    const valid = await em.findOne(User, { username: options.username });
    if (!valid) {
      await em.persistAndFlush(user);
      return { user };
    }
    return {
      errors: [
        {
          field: "username",
          message: "that username already exist",
        },
      ],
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
