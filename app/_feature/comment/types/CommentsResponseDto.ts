export type CommentsResponseDto = {
  createdAt: string | number | Date;
  id: string;
  body: string;
  postId: string;
  authorId: string;
  authorName: string;
};

export type CommentsCreateResponseDto = {
  id: string;
  body: string;
  postId: string;
  authorId: string;
  authorName: string;
  postAuthorId: string;
  createdAt: string;
};
