// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';

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

  httpGetPostReports = ({
    searchText,
    locationText,
    page = 0,
    limit = 9,
  }: {
    searchText: string;
    locationText: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/httpGetPostReports?searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}`
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

  httpDeletePost = (id: string): Promise<IResponseInterface> =>
    this.delete(`${this.prefix}/deletePost/${id}`);

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

  httpGetPostsShare = (): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/postsShare`);

  httpUpdatePostShare = (id: string): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/postShare/${id}`);
}
export const socialMediaService = new SocialMediaService();
