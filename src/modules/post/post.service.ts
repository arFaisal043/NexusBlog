import { CommentStatus, ContentStatus, ReactionType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPopularPostQueryOptions, IPostQueryOptions, IUpdatePostPayload } from "./post.interface";
import { calculatePagination, getPaginationMeta } from "../../utils/pagination";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    if (payload.isPremium) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (subscription?.status !== "ACTIVE") {
        throw new Error("Only premium users can create premium content.");
      }
    }

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

    const where: any = {
      isPremium: false,
    };

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

const getPostsById = async (postId: string, userId?: string) => {
  // First, check if the post exists and if it's premium
  const postCheck = await prisma.post.findUniqueOrThrow({
    where: { 
      id: postId 
    },
  });

  // If the post is premium, ensure the user is logged in and has an active subscription
  if (postCheck.isPremium) {
    if (!userId) {
      throw new Error("You must be logged in to view premium content.");
    }
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    if (subscription?.status !== "ACTIVE") {
      throw new Error("Please subscribe to access premium contents.");
    }
  }

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

const updatePost = async (postId: string, payload: IUpdatePostPayload, userId: string) => {
  // is post exist?
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  })

  if (payload.isPremium) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription?.status !== "ACTIVE") {
      throw new Error("Only premium users can update to premium content.");
    }
  }

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

const deletePost = async (postId: string, userId: string) => {
  // is post exist?
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  });

  // Verify ownership
  if (post.authorId !== userId) {
    throw new Error("You do not have permission to delete this post.");
  }

  // If it's a premium post, verify they have an active subscription
  if (post.isPremium) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (subscription?.status !== "ACTIVE") {
      throw new Error("Only active premium users can delete their premium posts.");
    }
  }

  // delete the post
  const result = await prisma.post.delete({
    where: {
      id: postId
    }
  });

  return result;
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

// __________ GET POPULAR POSTS ────────────────────────────────────

const getPopularPosts = async (queryOptions: IPopularPostQueryOptions) => {
  // Step 1: Parse query params
  const limit = Math.min(Number(queryOptions.limit) || 10, 20);
  const timeframe = queryOptions.timeframe || "all";

  // Step 2: Build the optional date filter 
  let createdAtFilter: Date | undefined = undefined;

  if (timeframe !== "all") {
    const now = new Date();
    if (timeframe === "day") {
      // Last 24 hours
      createdAtFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } 
    else if (timeframe === "week") {
      // Last 7 days
      createdAtFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } 
    else if (timeframe === "month") {
      // Last 30 days
      createdAtFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Step 3: Fetch posts from DB
  const posts = await prisma.post.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      isPremium: false,
      ...(createdAtFilter && { createdAt: { gte: createdAtFilter } }),
    },
    select: {
      id: true,
      title: true,
      thumbnail: true,
      tags: true,
      views: true,
      createdAt: true,
      // Fetch author info but omit password for security
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      // Count only APPROVED comments (same filter as other APIs)
      _count: {
        select: {
          // counts all reactions (LIKE + DISLIKE) at SQL level
          reactions: true,
          // counts all approved comments at SQL level
          comments: {
            where: {
              status: CommentStatus.APPROVED,
            },
          },
        },
      },
    },
  });

  // Step 4: Count only LIKE reactions per post 
  // This is ONE single DB query — not N queries.
  const likeCountsRaw = await prisma.reaction.groupBy({
    by: ["postId"],
    where: {
      type: ReactionType.LIKE,
      postId: { in: posts.map((p) => p.id) },
    },
    _count: {
      _all: true,
    },
  });

  // Convert the groupBy array into a Map for O(1) lookup by postId
  // Map shape: { postId -> likeCount }
  const likeCountMap = new Map<string, number>(
    likeCountsRaw.map((item) => [item.postId, item._count._all])
  );

  // Step 5: Compute popularity score for every post
  // Formula: Score = (views × 1.0) + (likes × 3.0) + (comments × 2.0)
  const scoredPosts = posts.map((post) => {
    const views    = post.views;                                
    const likes    = likeCountMap.get(post.id) ?? 0;         
    const comments = post._count.comments;                   

    const popularityScore =
      views * 1.0 +
      likes * 3.0 +
      comments * 2.0;

    return {
      ...post,
      likes,        
      popularityScore,
    };
  });

  // Step 6: Sort by score (descending) & slice to requested limit
  const popularPosts = scoredPosts
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);

  return {
    timeframe,
    limit,
    data: popularPosts,
  };
};

export const postService = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostStats,
  postSearchService,
  getPopularPosts,
};