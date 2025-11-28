// Importing base class

import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { HttpService } from './base.service';

class SocialMediaService extends HttpService {
  private readonly prefix: string = 'api/social-media';

  httpGetPosts = ({
    searchText = '',
    page = 0,
    limit = 9,
  }: {
    searchText?: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getPosts?searchText=${searchText}&page=${page}&limit=${limit}`
    );

  httpGetUserPosts = ({
    id,
    searchText = '',
    page = 0,
    limit = 9,
  }: {
    id: string;
    searchText?: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getUserPosts/${id}?searchText=${searchText}&page=${page}&limit=${limit}`
    );

  httpGetPost = ({
    id,
    page = 0,
    limit = 9,
  }: {
    id: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getPost/${id}?page=${page}&limit=${limit}`);

  httpGetPostComments = ({
    id,
    page = 0,
    limit = 9,
  }: {
    id: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getPostComments/${id}?page=${page}&limit=${limit}`
    );

  httpAddReport = ({
    id,
    body,
  }: {
    id: string;
    body: {
      reason: string;
      description: string;
      reportedBy: string;
      commentId?: string;
    };
  }): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/addReport/${id}`, body);

  httpGetPostsReports = ({
    searchText = '',
    locationText = '',
    page = 0,
    limit = 9,
  }: {
    searchText?: string;
    locationText?: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getPostsReports/?searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}`
    );

  httpAddDeletePost = ({
    id,
    body,
  }: {
    id: string;
    body: {
      reason: string;
      description: string;
    };
  }): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/addPostReport/${id}`, body);

  httpGetDeletePosts = ({
    searchText = '',
    locationText = '',
    page = 0,
    limit = 9,
  }: {
    searchText?: string;
    locationText?: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getDeletePosts?searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}`
    );
  httpDeletePost = (id: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/deletePost/${id}`);

  httpDeletePostByAdmin = (id: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/deletePostAdmin/${id}`);

  httpGetComment = (id: string): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/comment/${id}`);
  httpGetBlockedUsers = ({
    searchText = '',
    locationText = '',
    page = 0,
    limit = 9,
  }: {
    searchText?: string;
    locationText?: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getBlockedUsers?searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}`
    );

  httpCreatePost = (data: any): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/createPost`, data);

  httpUpdatePost = (id: string, data: any): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/updatePost/${id}`, data);

  httpAddPostReaction = ({
    id,
    body,
  }: {
    id: string;
    body: { type: string };
  }): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/addPostReaction/${id}`, body);

  httpAddCommentReaction = ({
    id,
    body,
  }: {
    id: string;
    body: { type: string };
  }): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/addCommentReaction/${id}`, body);

  httpAddPostComment = ({
    id,
    content,
    type = 'post',
  }: {
    id: string;
    content: string;
    type?: string;
  }): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/addPostComment/${id}`, { content, type });

  httpUpdatePostComment = ({
    id,
    content,
  }: {
    id: string;
    content: string;
  }): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/updatePostComment/${id}`, { content });

  httpReplyComment = ({
    id,
    body,
  }: {
    id: string;
    body: { parentCommentId: string; content: string };
  }): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/addReplyComment/${id}`, body);

  httpDeletePostComment = (id: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/deletePostComment/${id}`);
}
export const socialMediaService = new SocialMediaService();
