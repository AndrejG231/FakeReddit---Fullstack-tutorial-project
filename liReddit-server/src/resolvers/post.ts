import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post, Upvote } from "../entities";
import { DeleteResult, getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @Mutation(() => Number)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const realValue = value > 0 ? 1 : -1;
    let updateValue = 0;

    const upvote = await Upvote.findOne({ where: { postId, userId } });
    if (upvote && upvote.value !== realValue) {
      updateValue = realValue * 2;
      await getConnection().query(
        `
    START TRANSACTION;
    update upvote
    set value = ${realValue}
    where "postId" = ${postId} and "userId" = ${userId};

    update post
    set points = points + ${updateValue}
    where id = ${postId};
    COMMIT;
    `
      );
    } else if (!upvote) {
      updateValue = realValue;
      await getConnection().query(
        `
    START TRANSACTION;
    insert into upvote ("userId", "postId", value)
    values (${userId},${postId},${realValue});
    update post
    set points = points + ${updateValue}
    where id = ${postId};
    COMMIT;
    `
      );
    }
    return updateValue;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit) + 1;
    const realLimitAdded = realLimit + 1;

    const replacements: any[] = [realLimitAdded];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email',u.email
     ) creator
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitAdded,
    };
  }

  @Query(() => Number)
  @UseMiddleware(isAuth)
  async voted(@Arg("postId") postId: number, @Ctx() { req }: MyContext) {
    const userId = await req.session.userId;
    const votedValue = await getConnection().query(
      `
      select value from upvote
      where "userId" = ${userId} and "postId" = ${postId}
      `
    );

    if (typeof votedValue[0] !== "undefined") {
      return votedValue[0].value;
    }
    return 0;
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | undefined> {
    const post = await getConnection().query(
      `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email',u.email
     ) creator
    from post p
    inner join public.user u on u.id = p."creatorId"
    where p."id" = ${id}
    order by p."createdAt" DESC
    `
    );

    console.log(post);
    return post[0];
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg('text', () => String) text: string,
    @Ctx() {req}: MyContext
  ): Promise<Post | null> {
    const post = await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({title, text})
    .where(`id = :id and "creatorId" = :creatorId`, {id, creatorId: req.session.userId})
    .returning('*')
    .execute()

    return post.raw[0]
  }

  @Mutation(() => Number)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int ) id: number,
    @Ctx() { req }: MyContext
  ): Promise<number> {
    const userId = await req.session.userId
    const output = await Post.delete({id, creatorId: userId});

    if(typeof output.affected === 'number'){

      if(output.affected === 1){
        await Upvote.delete({postId: id})
      }

      return output.affected
    }

    return 0
  }
}
