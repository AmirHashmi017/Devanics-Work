import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socialMediaService } from 'src/services/social-media.service';
import Profile from '../components/post/Profile';
import { useDispatch } from 'react-redux';
import { IComment } from '../components/comment';
import { setFetchComments } from 'src/redux/social-media/social-media.slice';
import SkeletonLoader from 'src/components/loader/Skeleton';

const SingelComment = () => {
  const { commentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [commentData, setCommentData] = useState<IComment>({} as IComment);
  const [refetch, setRefetch] = useState(false);

  const getComment = async () => {
    try {
      setIsLoading(true);
      const {
        data: { comment },
      } = await socialMediaService.httpGetComment(commentId!);
      setCommentData(comment);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deletePostCommentHandler = async () => {
    try {
      await socialMediaService.httpDeletePostComment(commentData._id);
      dispatch(setFetchComments());
      setRefetch((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (commentId) {
      getComment();
    }
  }, [commentId, refetch]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!commentData) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between gap-3">
        <Profile
          name={commentData.associatedCompany.name}
          date={commentData.updatedAt}
          onClick={() => {}}
          isOwner={true}
        />
        <div
          onClick={deletePostCommentHandler}
          className="flex gap-2 h-6 cursor-pointer rounded-[3px] px-2 items-center bg-schestiLightPrimary"
        >
          <img
            src="/assets/icons/trash-03.svg"
            className="size-3"
            alt="profile"
          />
        </div>
      </div>
      <p className="mt-3 text-stormGrey">{commentData.content}</p>
    </div>
  );
};

export default SingelComment;
