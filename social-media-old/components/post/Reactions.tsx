import React, { useState } from 'react';
import Image from 'next/image';
import { socialMediaService } from '@/app/services/social-media.service';
import { IUserReaction } from '.';
import { useUser } from '@/app/hooks/useUser';

type Props = {
  id: string;
  userReaction: IUserReaction | null;
  reactions: IUserReaction[];
  isPost?: boolean;
};
const reactionTypes: any = {
  like: '/like-blue.svg',
  love: '/heart-01.svg',
  clap: '/clap.svg',
};

const Reactions = ({
  id,
  userReaction = null,
  reactions = [],
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

  const postReactionTypes = [
    {
      img: '/like-blue.svg',
      type: 'like',
    },
    {
      img: '/heart-01.svg',
      type: 'love',
    },
    {
      img: '/clap.svg',
      type: 'clap',
    },
  ];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div className="flex gap-2 items-center">
        {currentUserReaction ? (
          <Image
            src={reactionTypes[currentUserReaction]}
            className="cursor-pointer"
            onClick={() => {
              addPostReactionHandler({ removeReaction: true });
              setCurrentUserReaction('');
              setCurrentReactions((prev) =>
                prev.filter(
                  ({ associatedCompany }) => associatedCompany !== user?._id
                )
              );
            }}
            width={20}
            height={20}
            alt={currentUserReaction}
          />
        ) : (
          <Image
            src="/like-plain.svg"
            className="cursor-pointer"
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
            width={22}
            height={22}
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
          {postReactionTypes.map(({ img, type }, i) => (
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
              key={i}
            >
              <img
                src={img}
                className="cursor-pointer size-5 mix-blend-multiply rounded-full"
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
