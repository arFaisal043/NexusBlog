import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reactionService } from "./reaction.service";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const toggleReaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const { type } = req.body;
  const userId = req.user?.id as string;
  const result = await reactionService.toggleReaction(postId, userId, type);
  sendSuccess(res, statusCode.OK, result.message, result.data);
});

export const reactionController = {
  toggleReaction,
};
