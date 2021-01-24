import { Request, Response } from "express";
import { InputType, Field } from "type-graphql";
import { Redis } from 'ioredis';

export type MyContext = {
  req: Request & { session: any};
  res: Response;
  redis: Redis;
};

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}