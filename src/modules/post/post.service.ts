import { CommentStatus, ContentStatus, ReactionType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQueryOptions, IUpdatePostPayload } from "./post.interface";
import { calculatePagination, getPaginationMeta } from "../../utils/pagination";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
      data: {
        ...payload,
        authorId: userId,
      },
    });

    return result;
};

//__________ Searching in getAllPosts API ________________________________
// -> api/posts
// -> api/posts?title=AI&tag=AI&sort=popular&page=1&limit=4

const getAllPosts = async (queryOptions: IPostQueryOptions) => {
    const { search, tag, sort } = queryOptions;

    // From Pagination utils
    const { page, limit, skip } = calculatePagination(queryOptions);

    const where: any = {};

    if(search) {
      where.OR = [
        { 
          title: { contains: search as string, mode: "insensitive" } 
        },
        { 
          content: { contains: search as string, mode: "insensitive" } 
        },
      ];
    }

    const filterTag = tag;
    if(filterTag) {
      where.tags = {
        has: filterTag as string,
      };
    }


    let orderBy: any = { createdAt: "desc" };

    if(sort === "popular") {
      orderBy = { views: "desc" };
    } 
    else if(sort === "latest") {
      orderBy = { createdAt: "desc" };
    }

    const allPost = await prisma.post.findMany({
      where,
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED, 
          },
        },
        _count: {
          select: {
            reactions: true
          }
        }
      },
      orderBy,
      // pagination
      take: limit,
      skip,
    });

    const total = await prisma.post.count({ where });

    return {
      meta: getPaginationMeta(total, page, limit),
      data: allPost,
    };
}

const postSearchService = async () => {
  const posts = await prisma.post.findMany({
    // ________ Searching __________________________

    // where: {
    //   title: "My Fourth Blog Post",
    //   //content: "This is the full content of my blog post..."
    // },

    // // ________ Exact Searching __________________________
    // where: {
    //   AND: [
    //     {
    //       title: "My Fourth Blog Post", // Case sensitive
    //     },
    //     {
    //       content: "This is the full content of my blog post...",
    //     },
    //   ],
    // },

    // // ________ Partial Searching __________________________
    where: {
      OR: [
        {
          title: {
            contains: "My Fou",
            mode: "insensitive", // Not Case sensitive
          },
        },
        {
          content: {
            contains: "This is the full content of my blog post",
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
};

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
          reactions: true,
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
        // const totalPosts = await tx.post.count();

        // const totalPublishedPosts = await tx.post.count({
        //   where: {
        //     status: ContentStatus.PUBLISHED
        //   }
        // });

        // const totalDraftPosts = await tx.post.count({
        //   where: {
        //     status: ContentStatus.DRAFT
        //   },
        // });

        // const totalArchivedPosts = await tx.post.count({
        //   where: {
        //     status: ContentStatus.ARCHIVED
        //   },
        // });

        // const totalComments = await tx.comment.count();

        // const totalApprovedComments = await tx.comment.count({
        //   where: {
        //     status: CommentStatus.APPROVED
        //   }
        // });

        // const totalRejectedComments = await tx.comment.count({
        //   where: {
        //     status: CommentStatus.REJECT,
        //   },
        // });


        // // ______ Total post views

        // // - Not good approach -> O(n)
        // // const allPost = await tx.post.findMany();
        // // let totalPostView = 0;

        // // allPost.forEach( (post) => {
        // //   totalPostView += post.views;
        // // })

        // // - Use Aggregate function
        // const totalPostViewsAggregate = await tx.post.aggregate({
        //   _sum: {
        //     views: true
        //   }
        // })
        // const totalPostViews = totalPostViewsAggregate._sum.views;

        // return {
        //   totalPosts,
        //   totalPublishedPosts,
        //   totalDraftPosts,
        //   totalArchivedPosts,
        //   totalComments,
        //   totalApprovedComments,
        //   totalRejectedComments,
        //   totalPostViews,
        // };


        const [
          totalPosts,
          totalPublishedPosts,
          totalDraftPosts,
          totalArchivedPosts,
          totalComments,
          totalApprovedComments,
          totalRejectedComments,
          totalPostViews,
          totalLikes,
          totalDislikes,
        ] = await Promise.all([
          await tx.post.count(),

          await tx.post.count({
            where: {
              status: ContentStatus.PUBLISHED,
            },
          }),

          await tx.post.count({
            where: {
              status: ContentStatus.DRAFT,
            },
          }),

          await tx.post.count({
            where: {
              status: ContentStatus.ARCHIVED,
            },
          }),

          await tx.comment.count(),
          await tx.comment.count({
            where: {
              status: CommentStatus.APPROVED,
            },
          }),

          await tx.comment.count({
            where: {
              status: CommentStatus.REJECT,
            },
          }),

          await tx.post.aggregate({
            _sum: {
              views: true,
            },
          }),

          await tx.reaction.count({
            where: {
              type: ReactionType.LIKE,
            },
          }),

          await tx.reaction.count({
            where: {
              type: ReactionType.DISLIKE,
            },
          }),
        ]);

        return {
          totalPosts,
          totalPublishedPosts,
          totalDraftPosts,
          totalArchivedPosts,
          totalComments,
          totalApprovedComments,
          totalRejectedComments,
          totalPostViews: totalPostViews._sum.views,
          totalLikes,
          totalDislikes,
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
  getPostStats,
  postSearchService,
};