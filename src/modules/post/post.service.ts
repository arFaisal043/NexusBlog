import { CommentStatus, ContentStatus } from "../../../generated/prisma/enums";
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
  // ________ for count views
  await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      views: {
        increment: 1
      }
    }
  })

  // throw new Error("Fake Error");

  // _______ updated data after counting views
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
        },
        orderBy: {
          createdAt: "desc"
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

const getPostStats = async () => {
    // we use Transaction , because here have multiple query and all are required. if any failed it may can Big errors
    const transactionResult = await prisma.$transaction(async (tx) => {
        // ALL STATISTICAL DATA
        const totalPosts = await tx.post.count();

        const totalPublishedPosts = await tx.post.count({
          where: {
            status: ContentStatus.PUBLISHED
          }
        });

        const totalDraftPosts = await tx.post.count({
          where: {
            status: ContentStatus.DRAFT
          },
        });

        const totalArchivedPosts = await tx.post.count({
          where: {
            status: ContentStatus.ARCHIVED
          },
        });

        const totalComments = await tx.comment.count();

        const totalApprovedComments = await tx.comment.count({
          where: {
            status: CommentStatus.APPROVED
          }
        });

        const totalRejectedComments = await tx.comment.count({
          where: {
            status: CommentStatus.REJECT,
          },
        });


        // ______ Total post views

        // - Not good approach -> O(n)
        // const allPost = await tx.post.findMany();
        // let totalPostView = 0;

        // allPost.forEach( (post) => {
        //   totalPostView += post.views;
        // })

        // - Use Aggregate function
        const totalPostViewsAggregate = await tx.post.aggregate({
          _sum: {
            views: true
          }
        })
        const totalPostViews = totalPostViewsAggregate._sum.views;

        return {
          totalPosts,
          totalPublishedPosts,
          totalDraftPosts,
          totalArchivedPosts,
          totalComments,
          totalApprovedComments,
          totalRejectedComments,
          totalPostViews,
        };

      }
    )

    return transactionResult;
}

export const postService = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostsById,
    updatePost,
    deletePost,
    getPostStats
}