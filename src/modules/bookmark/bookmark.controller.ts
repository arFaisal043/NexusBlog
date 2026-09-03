import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookmarkService } from "./bookmark.service";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const toggleBookmark = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const userId = req.user?.id as string;
  const result = await bookmarkService.toggleBookmark(postId as string, userId);
  sendSuccess(res, statusCode.OK, result.message, result);
});

const getMyBookmarks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const result = await bookmarkService.getMyBookmarks(userId, req.query);
  sendSuccess(res, statusCode.OK, "Bookmarks fetched successfully", result);
});

export const bookmarkController = {
  toggleBookmark,
  getMyBookmarks,
};
