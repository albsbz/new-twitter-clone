import { create } from "zustand";
const useReactPostState = create<{
  reactions: Record<string, { isLiked: boolean; isDisliked: boolean }>;
  addLike: (postId: string) => void;
  removeLike: (postId: string) => void;
  addDislike: (postId: string) => void;
  removeDislike: (postId: string) => void;
}>()((set) => ({
  reactions: {},
  addLike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
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
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: current ? current.isLiked : false,
            isDisliked: false,
          },
        },
      };
    }),
}));

export default useReactPostState;