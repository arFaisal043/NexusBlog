import { ContentStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: ContentStatus;
  tags: string[];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: ContentStatus;
  tags?: string[];
}

// Demo search & filter api: search=api&tag=backend&sort=popular&page=1&limit=10
export interface IPostQueryOptions {
  search?: string;
  tag?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

// Popular post query options
// limit  -> how many top posts to return (default: 10, max: 20)
// timeframe -> filter posts by creation date: day / week / month / all
export interface IPopularPostQueryOptions {
  limit?: string | number;
  timeframe?: "day" | "week" | "month" | "all";
}