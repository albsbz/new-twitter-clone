import { create } from "zustand";
const useReactPostState = create<{
  reactions: Record<
    string,
    {
      isLiked: boolean;
      isDisliked: boolean;
    }
  >;
  reactionsQtty: Record<
    string,
    {
      likeCount: number;
      dislikeCount: number;
    }
  >;

  addLike: (postId: string) => void;
  removeLike: (postId: string) => void;
  addDislike: (postId: string) => void;
  removeDislike: (postId: string) => void;
  incrementLikeCount: (postId: string) => void;
  decrementLikeCount: (postId: string) => void;
  incrementDislikeCount: (postId: string) => void;
  decrementDislikeCount: (postId: string) => void;
  setLikesQtty: (
    postId: string,
    likeCount: number,
    dislikeCount: number,
  ) => void;
}>()((set) => ({
  reactions: {},
  reactionsQtty: {},
  addLike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: true,
            isDisliked: current ? current.isDisliked : false,
          },
        },
      };
    }),
  removeLike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: false,
            isDisliked: current ? current.isDisliked : false,
          },
        },
      };
    }),
  addDislike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: current ? current.isLiked : false,
            isDisliked: true,
          },
        },
      };
    }),
  removeDislike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: current ? current.isLiked : false,
            isDisliked: false,
          },
        },
      };
    }),
  incrementLikeCount: (postId: string) =>
    set((state) => {
      const current = state.reactionsQtty[postId];
      return {
        ...state,
        reactionsQtty: {
          ...state.reactionsQtty,
          [postId]: {
            likeCount: current ? current.likeCount + 1 : 1,
            dislikeCount: current ? current.dislikeCount : 0,
          },
        },
      };
    }),
  decrementLikeCount: (postId: string) =>
    set((state) => {
      const current = state.reactionsQtty[postId];
      return {
        ...state,
        reactionsQtty: {
          ...state.reactionsQtty,
          [postId]: {
            likeCount:
              current && current.likeCount > 0 ? current.likeCount - 1 : 0,
            dislikeCount: current ? current.dislikeCount : 0,
          },
        },
      };
    }),
  incrementDislikeCount: (postId: string) =>
    set((state) => {
      const current = state.reactionsQtty[postId];
      return {
        ...state,
        reactionsQtty: {
          ...state.reactionsQtty,
          [postId]: {
            likeCount: current ? current.likeCount : 0,
            dislikeCount: current ? current.dislikeCount + 1 : 1,
          },
        },
      };
    }),
  decrementDislikeCount: (postId: string) =>
    set((state) => {
      const current = state.reactionsQtty[postId];
      return {
        reactionsQtty: {
          ...state.reactionsQtty,
          [postId]: {
            likeCount: current ? current.likeCount : 0,
            dislikeCount:
              current && current.dislikeCount > 0
                ? current.dislikeCount - 1
                : 0,
          },
        },
      };
    }),
  setLikesQtty: (postId: string, likeCount: number, dislikeCount: number) =>
    set((state) => ({
      ...state,
      reactionsQtty: {
        ...state.reactionsQtty,
        [postId]: { likeCount, dislikeCount },
      },
    })),
}));

export default useReactPostState;
