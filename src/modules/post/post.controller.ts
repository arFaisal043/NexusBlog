import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;
    const result = await postService.createPost(payload, id);
    sendSuccess(res, statusCode.CREATED, "Post created successfully!", result);
});

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();
    sendSuccess(res, statusCode.OK, "All post retrieve successfully!", result);
});

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id as string;
  const result = await postService.getMyPosts(id);
  sendSuccess(res, statusCode.OK, "My all post retrieve successfully!", result);
});

const getPostsById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.postId as string;
  const result = await postService.getPostsById(postId);
  sendSuccess( res, statusCode.OK, "Post retrieve successfully!", result);
});

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.postId as string;
  const payload = req.body;
  const result = await postService.updatePost(id, payload);
  sendSuccess(res, statusCode.OK, "Post updated successfully!", result);
});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const postController = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostStats
};