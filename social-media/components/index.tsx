import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { socialMediaService } from '@/app/services/social-media.service';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SkeletonLoader from '@/app/component/loader/Skeleton';


export interface IUserReaction {
  type: string;
  associatedCompany: string;
  _id: string;
}
export interface IPost {
  _id: string;
  description?: string;
  associatedCompany: IUserInterface;
  mediaFiles: IMediaFile[];
  userReaction: IUserReaction;
  reactions: IUserReaction[];
  pinPosts: string[];
  savedPosts: string[];
  createdAt: string;
  updatedAt: string;
  feeling?: string;
  __v: number;
}

export interface IMediaFile {
  type: string;
  url: string;
  name: string;
  extension: string;
  _id?: string;
}
