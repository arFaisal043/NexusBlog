import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
      data: {
        ...payload,
        authorId: userId,
      },
    });

    return result;
};

const getAllPosts = async () => {
    const result = await prisma.post.findMany({
      include: {
        author: {
          omit: {
            password: true
          }
        },
        comments: true
      }
    });

    return result;
}

const getMyPosts = async () => {}
const getPostsByID = async () => {}
const updatePost = async () => {}
const deletePost = async () => {}
const getPostStats = async () => {}

export const postService = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostsByID,
    updatePost,
    deletePost,
    getPostStats
}