import { createSlice } from '@reduxjs/toolkit';
import { IMediaFile } from 'src/pages/social-media/components/post';

interface ISocialMedia {
  fetchPosts: boolean;
  fetchComments: boolean;
  fetchBlockedUsers: boolean;
  fetchDeletePosts: boolean;
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
  fetchBlockedUsers: false,
  fetchDeletePosts: false,
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
    setFetchBlockedUsers: (state) => {
      state.fetchBlockedUsers = !state.fetchBlockedUsers;
    },
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
    setFetchDeletePosts: (state, { payload }) => {
      state.fetchDeletePosts = payload;
    },
    setPostData: (state, { payload }) => {
      state.postData = payload;
    },
  },
});

export const {
  setFetchPosts,
  setFetchDeletePosts,
  setFetchBlockedUsers,
  setFetchComments,
  setCommentContent,
  setSelectedPostId,
  setCommentId,
  setPostData,
} = socialMediaSlice.actions;
export default socialMediaSlice.reducer;
