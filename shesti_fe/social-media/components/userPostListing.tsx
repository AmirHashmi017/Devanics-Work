import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { socialMediaService } from '@/app/services/social-media.service';
import { Skeleton } from 'antd';
import { IPost } from '.';
import { useParams } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
// import { CreatePost } from './CreatePost';
import ModalComponent from '@/app/component/modal';
import { Popups } from '../../bid-management/components/Popups';
import { CreatePostModal } from './CreatePost';
import { useDispatch } from 'react-redux';
import { setPostData } from '@/redux/social-media/social-media.slice';

type Props = {
  fetchPosts?: boolean;
  onPostDeleted?: () => void;
  userId: string;
};

const UserPostListing = ({ fetchPosts, onPostDeleted, userId }: Props) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingPost, setCurrentEditingPost] = useState<IPost | null>(
    null
  );
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const getUserPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await socialMediaService.httpGetUserPosts({
        id: userId,
      });
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error, currentEditingPost);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id || user?._id) {
      getUserPosts();
    }
  }, [id, fetchPosts, user?._id]);

  // Handle hiding a post from the feed
  const handlePostHidden = (postId: string) => {
    setHiddenPostIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
  };

  // Handle editing a post
  const handleEditPost = (postData: IPost) => {
    setCurrentEditingPost(postData);
    setIsEditModalOpen(true);
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditingPost(null);
    dispatch(setPostData(null));
  };

  // Handle post action (after create/update)
  const handlePostAction = () => {
    getUserPosts(); // Refresh posts after any action
  };

  // Filter out hidden posts
  const visiblePosts = posts.filter((post) => !hiddenPostIds.has(post._id));

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  return (
    <div>
      {/* Edit Post Modal */}
      <ModalComponent open={isEditModalOpen} setOpen={handleCloseEditModal}>
        <Popups title="Update Post" onClose={handleCloseEditModal}>
          <CreatePostModal
            onClose={handleCloseEditModal}
            onPostAction={handlePostAction}
          />
        </Popups>
      </ModalComponent>

      {visiblePosts.length ? (
        visiblePosts.map((postData) => (
          <PostCard
            {...postData}
            key={postData._id}
            onPostDeleted={() => {
              onPostDeleted?.();
              handlePostAction(); // Refresh posts after deletion
            }}
            onPostHidden={handlePostHidden}
            onEditPost={handleEditPost}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-md font-semibold mt-2 text-gray-500">
            {hiddenPostIds.size > 0
              ? 'No more posts to show'
              : 'No Posts Available'}
          </p>
          {hiddenPostIds.size > 0 && (
            <button
              onClick={() => setHiddenPostIds(new Set())}
              className="mt-2 text-blue-500 hover:text-blue-600 underline"
            >
              Show hidden posts
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPostListing;
