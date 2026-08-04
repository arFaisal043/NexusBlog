import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentServices } from "./comment.service";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id as string;
    const result = await commentServices.createComment(payload, authorId);
    sendSuccess(res, statusCode.CREATED, "Comment created successfully!", result);
})

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId as string;
    const result = await commentServices.getCommentByAuthorId(authorId);
    sendSuccess( res, statusCode.OK, "Comment fetches successfully!", result);
})

const getCommentByCommentId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const result = await commentServices.getCommentByCommentId(commentId);
    sendSuccess(res, statusCode.OK, "Comment fetches successfully!", result);
})

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {})
const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {})
const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {})

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}