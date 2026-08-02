import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async () => {})
const getCommentByAuthorID = catchAsync(async () => {})
const getCommentByCommentID = catchAsync(async () => {})
const updateComment = catchAsync(async () => {})
const deleteComment = catchAsync(async () => {})
const moderateComment = catchAsync(async () => {})

export const commentController = {
    createComment,
    getCommentByAuthorID,
    getCommentByCommentID,
    updateComment,
    deleteComment,
    moderateComment
}