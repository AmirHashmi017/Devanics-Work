import ModalComponent from "@/app/component/modal";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { Popups } from "../../bid-management/components/Popups";
import CustomButton from "@/app/component/customButton/button";
import { socialMediaService } from '@/app/services/social-media.service';
import { toast } from 'react-toastify';
import filesUrlGenerator from '@/app/utils/filesUrlGenerator';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchPosts, setPostData } from '@/redux/social-media/social-media.slice';
import { RootState } from '@/redux/store';
import { useUser } from '@/app/hooks/useUser';
import { userService } from '@/app/services/user.service';
import Image from 'next/image';
import FeelingActivityFeature from './FeelingActivity';

interface IMediaFile {
    type: string;
    url: string;
    name: string;
    extension: string;
    _id?: string;
}

interface IPost {
    mediaFiles: IMediaFile[];
    description: string;
    feeling: string;
}

export function CreatePost() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { postData } = useSelector((state: RootState) => state.socialMedia);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPostData(null)); // Reset postData on mount to ensure Create Post modal
    }, [dispatch]);
    useEffect(() => {
        if (!isModalOpen && inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.blur();
        }
    }, [isModalOpen]);

    return (
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <ModalComponent open={isModalOpen} setOpen={() => setIsModalOpen(false)}>
                <Popups
                    title={postData ? "Update Post" : "Create Post"}
                    onClose={() => {
                        dispatch(setPostData(null));
                        setIsModalOpen(false);
                    }}
                >
                    <CreatePostModal
                        onClose={() => {
                            dispatch(setPostData(null));
                            setIsModalOpen(false);
                        }}
                    />
                </Popups>
            </ModalComponent>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <Avatar size={55} icon={<UserOutlined />} />
                </div>
                <div className="w-full border border-gray-200 rounded-full py-3 px-6 mb-4">
                    <input
                        type="text"
                        placeholder="Good Morning Eng Shereen ^_^"
                        className="w-full outline-none text-gray-700 text-lg"
                        onClick={() => setIsModalOpen(true)}
                        ref={inputRef}
                    />
                </div>
            </div>

            <div className="flex justify-between pl-12">
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="font-medium">Media</span>
                </div>

                <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="font-medium">Event</span>
                </div>

                <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <span className="font-medium">Write article</span>
                </div>
            </div>
        </div>
    );
}

interface CreatePostModalProps {
    onClose: () => void;
}

export function CreatePostModal({ onClose }: CreatePostModalProps) {
    const dispatch = useDispatch();
    const user = useUser();
    const [isFilesUploading, setIsFilesUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState('');
    const { postData } = useSelector((state: RootState) => state.socialMedia);
    const [postOldMediaUrls, setPostOldMediaUrls] = useState<IMediaFile[]>([]);
    const [showFeelingActivity, setShowFeelingActivity] = useState(false);
    const [feeling, setFeeling] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (postData) {
            const { description, mediaFiles, feeling } = postData;
            setDescription(description || '');
            setPostOldMediaUrls(mediaFiles || []);
            setFeeling(feeling || '');
        } else {
            resetPost();
        }
        setIsFilesUploading(false); // Reset loader when modal opens
    }, [postData]);

    

    async function createPost() {
        setIsFilesUploading(true);

        const { data } = await userService.httpIsBlocked();

        if (data.isBlocked) {
            setIsFilesUploading(false);
            return toast.error('You are Blocked contact administrator');
        }

        try {
            const { mediaFiles, mediaFilesLength } = await filesUrlGenerator(files);
            if (mediaFilesLength || description) {
                const payload: Partial<IPost> = {};

                if (mediaFiles) {
                    payload['mediaFiles'] = mediaFiles;
                }

                if (description) {
                    payload['description'] = description;
                }

                if (feeling) {
                    payload['feeling'] = feeling;
                }

                const { message } = await socialMediaService.httpCreatePost(payload);
                toast.success(message);
                dispatch(setPostData(null)); // Reset postData
                onClose();
            } else {
                toast.error('Description or image,video is required!');
            }
        } catch (error: any) {
            console.error('Error uploading file to S3:', error);
            toast.error(error?.response?.data?.message || `Unable to upload Files`);
            setIsFilesUploading(false);
        } finally {
            dispatch(setFetchPosts());
            resetPost();
            setIsFilesUploading(false); // Ensure loader is reset
        }
    }

    async function updatePost() {
        try {
            setIsFilesUploading(true);
            const { mediaFiles, mediaFilesLength } = await filesUrlGenerator(files);
            if (mediaFilesLength || postOldMediaUrls.length || description) {
                const allMediaFiles: IMediaFile[] = [];
                const payload: Partial<IPost> = {};

                if (mediaFilesLength) {
                    allMediaFiles.push(...mediaFiles);
                }
                if (postOldMediaUrls.length > 0) {
                    allMediaFiles.push(...postOldMediaUrls);
                }

                if (allMediaFiles.length > 0) {
                    payload['mediaFiles'] = allMediaFiles;
                }

                if (description) {
                    payload['description'] = description;
                }

                if (feeling) {
                    payload['feeling'] = feeling;
                }

                const { message } = await socialMediaService.httpUpdatePost(
                    postData?._id!,
                    payload
                );
                toast.success(message);
                dispatch(setPostData(null)); // Reset postData
                onClose();
            } else {
                toast.error('Description or image,video is required!');
            }
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            toast.error(`Unable to upload Files`);
            setIsFilesUploading(false);
        } finally {
            setIsFilesUploading(false);
            dispatch(setFetchPosts());
            resetPost();
        }
    }

    function resetPost() {
        files.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        setFiles([]);
        setDescription('');
        setFeeling('');
        setPostOldMediaUrls([]);
        dispatch(setPostData(null));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.files = null; // Explicitly clear files
            setFiles([]);
        }
    }

    const handleClose = () => {
        dispatch(setPostData(null)); // Reset postData on modal close
        onClose();
    };

    const userAvatar = user?.socialAvatar || user?.avatar || '/profileAvatar.png';
    const fullName = user?.socialName || user?.name || '';

    return (
        <div>
            <ModalComponent setOpen={setShowFeelingActivity} open={showFeelingActivity}>
                <FeelingActivityFeature
                    setIsModalOpen={setShowFeelingActivity}
                    setFeeling={setFeeling}
                />
            </ModalComponent>
            <div className="px-4 py-3 flex items-center gap-3">
                <Avatar size={55} src={userAvatar} icon={<UserOutlined />} />
                <div className="font-medium text-lg text-[#101828]">{fullName}</div>
            </div>

            <div className="px-4 pb-4">
                <textarea
                    rows={10}
                    placeholder={`Good Morning to ${fullName}`}
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                    className="w-full border rounded-md p-4 shadow-none resize-none focus-visible:ring-0 focus:outline-none text-lg text-[#98a2b3] placeholder:text-[#98a2b3]"
                />
            </div>

            <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                    {postOldMediaUrls.map(({ url, type }, i) => (
                        <div className="relative" key={`${url}-${i}`}>
                            <CloseCircleOutlined
                                onClick={() =>
                                    setPostOldMediaUrls((prev) =>
                                        prev.filter((_, fileIndex) => fileIndex !== i)
                                    )
                                }
                                className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-white"
                            />
                            {type.includes('image') ? (
                                <Image
                                    className="rounded-md"
                                    key={`${url}-${i}`}
                                    src={url}
                                    height={100}
                                    width={100}
                                    alt={'img-' + i}
                                />
                            ) : (
                                <video
                                    className="rounded-md size-[100px] object-cover"
                                    key={`${url}-${i}`}
                                    src={url}
                                />
                            )}
                        </div>
                    ))}

                    {files.map((file, i) => (
    <div
        className="relative"
        key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
    >
        <CloseCircleOutlined
            onClick={() =>
                setFiles((prev) =>
                    prev.filter((_, fileIndex) => fileIndex !== i)
                )
            }
            className="text-red-600 absolute -right-1 cursor-pointer rounded-full -top-1 bg-white"
        />
        {file.type.includes('image') ? (
            <Image
                className="rounded-md"
                key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
                src={URL.createObjectURL(file)}
                height={100}
                width={100}
                alt={'img-' + i}
            />
        ) : (
            <video
                className="rounded-md size-[100px] object-cover"
                key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
                src={URL.createObjectURL(file)}
            />
        )}
    </div>
))}
                </div>
            </div>

            <div className="px-4 py-3 flex justify-between">
                <div className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded">
                    <input
    multiple
    id="photo-video-modal"
    className="hidden"
    type="file"
    accept="image/*,video/*"
    ref={fileInputRef}
    onChange={({ target }) => {
        if (target.files && target.files.length > 0) {
            const selectedMediaFiles = Array.from(target.files).filter(
                ({ type }) => type.includes('video') || type.includes('image')
            );
            // Ensure unique files by checking name, size, and lastModified
            setFiles((prev) => {
                const existingFileKeys = new Set(
                    prev.map(f => `${f.name}-${f.size}-${f.lastModified}`)
                );
                const newFiles = selectedMediaFiles.filter(
                    f => !existingFileKeys.has(`${f.name}-${f.size}-${f.lastModified}`)
                );
                return [...prev, ...newFiles];
            });
        }
    }}
/>


                    <label htmlFor="photo-video-modal" className="cursor-pointer flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5 text-[#5ad439]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <span>Photo/Video</span>
                    </label>
                </div>

                <div className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded">
                    <div className="flex items-center justify-center w-5 h-5 text-[#007ab6]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <span>Tag Coworkers</span>
                </div>

                <div
                    onClick={() => setShowFeelingActivity(true)}
                    className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded"
                >
                    <div className="flex items-center justify-center w-5 h-5 text-[#ffd93b]">
                        <span className="text-xl">😀</span>
                    </div>
                    <span>Feeling/Activity {feeling && `is ${feeling}`}</span>
                </div>
            </div>

            <hr className="border-t border-gray-200" />

            <div className="p-4 flex gap-3">
                {postData && (
                    <CustomButton
                        disabled={isFilesUploading}
                        onClick={resetPost}
                        text={'Cancel'}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                    />
                )}
                <CustomButton
                    text={postData ? 'Update' : 'Create Post'}
                    className="flex-1"
                    onClick={() => (postData ? updatePost() : createPost())}
                    isLoading={isFilesUploading}
                />
            </div>
        </div>
    );
}