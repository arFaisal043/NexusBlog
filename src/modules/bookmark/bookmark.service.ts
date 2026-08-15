import { prisma } from "../../lib/prisma";
import { IBookmarkQueryOptions } from "./bookmark.interface";
import { calculatePagination, getPaginationMeta } from "../../utils/pagination";

const toggleBookmark = async (postId: string, userId: string) => {
  // Check if post exists
  await prisma.post.findUniqueOrThrow(
    { 
      where: { 
        id: postId 
      } 
    }
  );

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingBookmark) {
    // Toggle off
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });

    return { message: "Bookmark removed", action: "removed" };
  } 
  else {
    // Create new bookmark
    const newBookmark = await prisma.bookmark.create({
      data: {
        postId,
        userId,
      },
    });

    return { message: "Bookmark added", action: "added", data: newBookmark };
  }
};

const getMyBookmarks = async (userId: string, queryOptions: IBookmarkQueryOptions) => {
  // Use Reusable Pagination Utility
  const { page, limit, skip } = calculatePagination(queryOptions);

  const where = { userId };

  const bookmarks = await prisma.bookmark.findMany({
    where,
    include: {
      post: {
        include: {
          author: {
            omit: { password: true },
          },
          _count: {
            select: { reactions: true, comments: true },
          }
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const total = await prisma.bookmark.count({ where });

  return {
    meta: getPaginationMeta(total, page, limit),
    data: bookmarks,
  };
};

export const bookmarkService = {
  toggleBookmark,
  getMyBookmarks,
};
