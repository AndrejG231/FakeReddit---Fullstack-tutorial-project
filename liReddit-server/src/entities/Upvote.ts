import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post, User } from ".";

@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post)
  post: Post;
}