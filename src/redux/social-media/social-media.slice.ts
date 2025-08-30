import { IMediaFile } from '@/app/(pages)/social-media-old/components/post';
import { createSlice } from '@reduxjs/toolkit';

interface ISocialMedia {
  fetchPosts: boolean;
  fetchComments: boolean;
  commmentContent: string;
  selectedPostId: string;
  commentId: string;
  postData: {
    _id: string;
    description: string;
    mediaFiles: IMediaFile[];
  } | null;
}

const initialState: ISocialMedia = {
  fetchPosts: false,
  fetchComments: false,
  commmentContent: '',
  selectedPostId: '',
  commentId: '',
  postData: {
    _id: '',
    description: '',
    mediaFiles: [],
  },
};

const socialMediaSlice = createSlice({
  name: 'social-media',
  initialState,
  reducers: {
    setFetchPosts: (state) => {
      state.fetchPosts = !state.fetchPosts;
    },
    setFetchComments: (state) => {
      state.fetchComments = !state.fetchComments;
    },
    setCommentContent: (state, { payload }) => {
      state.commmentContent = payload;
    },
    setSelectedPostId: (state, { payload }) => {
      state.selectedPostId = payload;
    },
    setCommentId: (state, { payload }) => {
      state.commentId = payload;
    },
    setPostData: (state, { payload }) => {
      state.postData = payload;
    },
  },
});

export const {
  setFetchPosts,
  setFetchComments,
  setCommentContent,
  setSelectedPostId,
  setCommentId,
  setPostData,
} = socialMediaSlice.actions;
export default socialMediaSlice.reducer;
