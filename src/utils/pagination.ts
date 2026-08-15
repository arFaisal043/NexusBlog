export interface IPaginationOptions {
  page?: string | number;
  limit?: string | number;
}

export interface IPaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const calculatePagination = (options: IPaginationOptions): IPaginationResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
