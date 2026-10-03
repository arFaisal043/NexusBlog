import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CustomError } from "../../utils/customError";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface";
import statusCode from "http-status";

const createComment = async (payload: ICreateCommentPayload, authorId: string) => {
    // Check if post exists and if it's premium
    const post = await prisma.post.findUniqueOrThrow({
        where: { id: payload.postId }
    });

    if (post.isPremium) {
        const subscription = await prisma.subscription.findUnique({
            where: { userId: authorId },
        });
        if (subscription?.status !== "ACTIVE") {
            throw new Error("Only active premium users can comment on premium posts.");
        }
    }

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

const updateComment = async (payload: IUpdateCommentPayload, commentId: string) => {
    const update = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: payload,
    });

    return update;
};

const deleteComment = async (commentId: string) => {
    // check if comment exist or not?
    const isCommentExist = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    })

    if(!isCommentExist) {
        throw new CustomError("Comment is not exist", statusCode.NOT_FOUND)
    }

    // if exist then delete
    const result = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    return result;
};

const moderateComment = async (
  commentId: string,
  role: string,
  status: any,
) => {
  if (role != Role.ADMIN) {
    throw new CustomError("User is not authorized", statusCode.FORBIDDEN);
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: status,
  });

  return result;
};

export const commentServices = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}