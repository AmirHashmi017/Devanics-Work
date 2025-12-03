import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { socialMediaService } from '@/app/services/social-media.service';
import { IUserReaction } from '.';
import { useUser } from '@/app/hooks/useUser';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Props = {
  id: string;
  userReaction: IUserReaction | null;
  reactions: IUserReaction[];
  isPost?: boolean;
  onReactionUpdate?: (
    reaction: IUserReaction | null,
    reactionType?: string
  ) => void;
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
  onReactionUpdate,
}: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  // FIX 2: Properly sync with parent component's user reaction state
  const [currentUserReaction, setCurrentUserReaction] = useState(
    userReaction?.type || ''
  );
  const [currentReactions, setCurrentReactions] = useState(
    (reactions as IUserReaction[]) || []
  );
  const user = useUser();

  // FIX 2: Update local state when props change (for proper syncing on page reload)
  useEffect(() => {
    setCurrentUserReaction(userReaction?.type || '');
    setCurrentReactions(reactions || []);
  }, [userReaction, reactions]);

  const addPostReactionHandler = async ({
    type = 'like',
    removeReaction = false,
  }: {
    type?: string;
    removeReaction?: boolean;
  }) => {
    try {
      let updatedReaction: IUserReaction | null = null;

      if (isPost) {
        const response = await socialMediaService.httpAddPostReaction({
          id,
          body: { type, ...(removeReaction && { removeReaction: true }) },
        });
        // FIX 2: Handle API response properly for reaction data
        updatedReaction = removeReaction
          ? null
          : {
              associatedCompany: user?._id!,
              type,
              _id:
                response.data?.reaction?._id || new Date().getTime().toString(),
            };
      } else {
        const response = await socialMediaService.httpAddCommentReaction({
          id,
          body: { type, ...(removeReaction && { removeReaction: true }) },
        });
        updatedReaction = removeReaction
          ? null
          : {
              associatedCompany: user?._id!,
              type,
              _id:
                response.data?.reaction?._id || new Date().getTime().toString(),
            };
      }

      // FIX 2: Update local state with smooth transitions
      if (removeReaction) {
        setCurrentUserReaction('');
        setCurrentReactions((prev) =>
          prev.filter(
            ({ associatedCompany }) => associatedCompany !== user?._id
          )
        );
        onReactionUpdate?.(null);
      } else {
        setCurrentUserReaction(type);
        setCurrentReactions((prev) => {
          const existingUserReactionIndex = prev.findIndex(
            ({ associatedCompany }) => associatedCompany === user?._id
          );

          if (existingUserReactionIndex >= 0) {
            // Update existing reaction
            const updatedReactions = [...prev];
            updatedReactions[existingUserReactionIndex] = {
              ...updatedReactions[existingUserReactionIndex],
              type,
            };
            return updatedReactions;
          } else {
            // Add new reaction
            return [
              ...prev,
              {
                associatedCompany: user?._id!,
                type,
                _id: new Date().getTime().toString(),
              },
            ];
          }
        });
        onReactionUpdate?.(updatedReaction, type);
      }

      setShowReactions(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Error updating reaction');
      console.log(error, 'error in reaction...');
    }
  };

  const postReactionTypes = [
    { img: '/like-blue.svg', type: 'like' },
    { img: '/heart-01.svg', type: 'love' },
    { img: '/clap.svg', type: 'clap' },
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
            className="cursor-pointer transition-all duration-200 hover:scale-110"
            onClick={() => addPostReactionHandler({ removeReaction: true })}
            width={20}
            height={20}
            alt={currentUserReaction}
            style={{
              filter: 'brightness(1.1)', // FIX 2: Make user's reaction slightly brighter
            }}
          />
        ) : (
          <Image
            src="/like-plain.svg"
            className="cursor-pointer transition-all duration-200 hover:scale-110"
            onClick={() => addPostReactionHandler({})}
            width={22}
            height={22}
            alt="like"
          />
        )}

        {currentReactions.length > 0 && (
          <p className="font-medium text-xs text-schestiPrimaryBlack">
            {currentUserReaction && 'You '}
            {currentReactions.length > 1 && currentUserReaction
              ? `and ${currentReactions.length - 1} Other${currentReactions.length - 1 > 1 ? 's' : ''}`
              : !currentUserReaction
                ? `${currentReactions.length}`
                : ''}
          </p>
        )}
      </div>

      {/* FIX 2: Enhanced reaction selector with smooth animations */}
      {showReactions && (
        <div
          className="absolute left-0 -top-12 flex space-x-2.5 bg-white p-3 rounded-full shadow-lg border border-gray-200 z-50 transition-all duration-200"
          style={{
            animation: 'fadeInUp 0.2s ease-out',
          }}
        >
          {postReactionTypes.map(({ img, type }, i) => (
            <button
              className="flex flex-col items-center text-center transition-all duration-150 hover:scale-125 p-1 rounded-full hover:bg-gray-100"
              onClick={() => addPostReactionHandler({ type })}
              key={i}
              style={{
                // FIX 2: Highlight current user's reaction type in the selector
                backgroundColor:
                  currentUserReaction === type ? '#e3f2fd' : 'transparent',
                transform:
                  currentUserReaction === type ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <img
                src={img}
                className="cursor-pointer size-6 mix-blend-multiply rounded-full"
                alt={type}
                style={{
                  filter:
                    currentUserReaction === type
                      ? 'brightness(1.2) saturate(1.2)'
                      : 'none',
                }}
              />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Reactions;
