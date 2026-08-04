import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async (payload: ICreateCommentPayload, authorId: string) => {
    const result = await prisma.comment.create({
        data: {
            postId: payload.postId,
            content: payload.content,
            authorId: authorId
        }
    })

    return result;
};

const getCommentByAuthorId = async (authorId: string) => {
    const comment = await prisma.comment.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return comment;
};

const getCommentByCommentId = async (commentId: string) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    })

    return comment;
};

const updateComment = async () => {};
const deleteComment = async () => {};
const moderateComment = async () => {};

export const commentServices = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}