import { ContentStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: ContentStatus;
  tags: string[];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
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