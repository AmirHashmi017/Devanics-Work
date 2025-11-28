import { useState } from 'react';
import { IUserReaction } from '.';
import { socialMediaService } from 'src/services/social-media.service';
import { useUser } from 'src/hooks/useUser';

type Props = {
  isPost?: boolean;
  id: string;
  userReaction: IUserReaction | null;
  reactions: IUserReaction[];
};

const reactionTypes: any = {
  like: 'assets/icons/like-blue.svg',
  love: 'assets/icons/heart-01.svg',
  clap: 'assets/icons/clap.svg',
};

const Reactions = ({
  id,
  userReaction = null,
  reactions,
  isPost = true,
}: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const [currentUserReaction, setCurrentUserReaction] = useState(
    userReaction?.type || ''
  );
  const [currentReactions, setCurrentReactions] = useState(
    (reactions as IUserReaction[]) || []
  );
  const user = useUser();
  const addPostReactionHandler = async ({
    type = 'like',
    removeReaction = false,
  }: {
    type?: string;
    removeReaction?: boolean;
  }) => {
    if (isPost) {
      try {
        await socialMediaService.httpAddPostReaction({
          id,
          body: { type, ...(removeReaction && { removeReaction: true }) },
        });
        setShowReactions(false);
      } catch (error) {
        console.log(error, 'erro in post reaction...');
      }
    } else {
      try {
        await socialMediaService.httpAddCommentReaction({
          id,
          body: { type, ...(removeReaction && { removeReaction: true }) },
        });
        setShowReactions(false);
      } catch (error) {
        console.log(error, 'erro in post reaction...');
      }
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div className="flex gap-2 items-center">
        {currentUserReaction ? (
          <img
            src={reactionTypes[currentUserReaction]}
            className="cursor-pointer size-5"
            onClick={() => {
              addPostReactionHandler({ removeReaction: true });
              setCurrentUserReaction('');
              setCurrentReactions((prev) =>
                prev.filter(
                  ({ associatedCompany }) => associatedCompany !== user?._id
                )
              );
            }}
            alt={currentUserReaction}
          />
        ) : (
          <img
            src="/assets/icons/like-plain.svg"
            className="cursor-pointer size-[22px]"
            onClick={() => {
              addPostReactionHandler({});
              setCurrentUserReaction('like');
              setCurrentReactions((prev) =>
                prev.concat({
                  associatedCompany: user?._id!,
                  type: 'like',
                  _id: new Date().getTime().toString(),
                })
              );
            }}
            alt="like"
          />
        )}

        {currentReactions.length > 0 && (
          <p className="font-medium text-xs text-schestiPrimaryBlack">
            {currentUserReaction && 'You '}
            {currentReactions.length > 1 && currentUserReaction
              ? `and ${currentReactions.length - 1} Other`
              : !currentUserReaction
                ? `${currentReactions.length}`
                : ''}
          </p>
        )}
      </div>

      {showReactions && (
        <div
          className="absolute left-0 -top-10 flex space-x-2.5 bg-white p-2 rounded-full shadow-lg border border-gray-200"
          style={{ paddingTop: '10px', marginTop: '10px' }}
        >
          {[
            {
              img: '/assets/icons/like-blue.svg',
              type: 'like',
            },
            {
              img: '/assets/icons/heart-01.svg',
              type: 'love',
            },
            {
              img: '/assets/icons/clap.svg',
              type: 'clap',
            },
          ].map(({ img, type }) => (
            <button
              className="flex flex-col items-center text-center"
              onClick={() => {
                addPostReactionHandler({ type });
                setCurrentUserReaction(type);
                setCurrentReactions((prev) => {
                  const loginUserReactionData = prev.find(
                    ({ associatedCompany }) => associatedCompany === user?._id
                  );
                  let updatedReactions = prev;
                  if (loginUserReactionData) {
                    updatedReactions = prev.map((reactionData) => {
                      if (loginUserReactionData) {
                        return { ...reactionData, type };
                      }
                      return reactionData;
                    });
                  } else {
                    updatedReactions = [
                      ...prev,
                      {
                        associatedCompany: user?._id!,
                        type,
                        _id: new Date().getTime().toString(),
                      },
                    ];
                  }
                  return updatedReactions;
                });
              }}
            >
              <img
                src={img}
                className="cursor-pointer size-5 mix-blend-multiply"
                alt={type}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reactions;
