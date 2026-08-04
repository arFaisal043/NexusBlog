export interface ICreateCommentPayload {
    postId: string,
    content: string
}

export interface IUpdateCommentPayload {
    content?: string
}