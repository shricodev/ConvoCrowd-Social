import { Comment, Post, Subconvo, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  subconvo: Subconvo;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
