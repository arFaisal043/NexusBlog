import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
    const allPost = await prisma.post.findMany({
      include: {
        author: {
          omit: {
            password: true
          }
        },
        // comments: true --> shows all comments
        comments: {
          where: {
            status: CommentStatus.APPROVED // only shows approved comment
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return allPost;
}

const getMyPosts = async (userId: string) => {
  const post = await prisma.post.findMany({
    where: {
      authorId: userId
    },

    orderBy: {
      createdAt: "desc"
    },

    include: {
      author: {
        omit: {
          password: true
        }
      },
      // comments: true --> shows all comments
      comments: {
        where: {
          status: CommentStatus.APPROVED // only shows approved comment
        }
      },
      // find how many comments has
      _count: {
        select: {
          comments: true
        }
      }
    }
  });

  return post;
}

const getPostsById = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.APPROVED
        }
      },
      // find how many comments has
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return post;
};

const updatePost = async (postId: string, payload: IUpdatePostPayload) => {
  // is post exist?
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  })

  // update based on users payload
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.APPROVED
        }
      },
      // find how many comments has
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const deletePost = async (postId: string) => {
  // is post exist?
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  })

  // delete the post
  const result = await prisma.post.delete({
    where: {
      id: postId
    }
  })
}

const getPostStats = async () => {}

export const postService = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostsById,
    updatePost,
    deletePost,
    getPostStats
}