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

const getCommentByAuthorID = async (authorId: string) => {
    
};

const getCommentByCommentID = async () => {};
const updateComment = async () => {};
const deleteComment = async () => {};
const moderateComment = async () => {};

export const commentServices = {
    createComment,
    getCommentByAuthorID,
    getCommentByCommentID,
    updateComment,
    deleteComment,
    moderateComment
}