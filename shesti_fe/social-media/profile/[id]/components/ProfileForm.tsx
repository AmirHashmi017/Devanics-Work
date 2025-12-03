import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { TextAreaComponent } from '@/app/component/textarea';
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Checkbox, DatePicker, Spin } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { BsCalendar, BsGlobe, BsUpload } from 'react-icons/bs';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import { useParams } from 'next/navigation';
import { userService } from '@/app/services/user.service';
import dayjs from 'dayjs';
import Image from 'next/image';
import filesUrlGenerator from '@/app/utils/filesUrlGenerator';

interface Experience {
  jobTitle: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  currentlyWorking: boolean;
  _id?: string;
}

interface Education {
  school: string;
  grade: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  currentlyStudying: boolean;
  _id?: string;
}

interface UserData {
  name: string;
  socialName: string;
  email: string;
  phone: string;
  avatar: string;
  socialAvatar: string;
  website: string;
  aboutMe: string;
  tagLine: string;
  address: string;
  city: string;
  state: string;
  country: string;
  socialLinks: {
    linkedin: string;
    youtube: string;
    instagram: string;
    whatsapp: string;
    twitter: string;
    facebook: string;
  };
  jobExperience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

export function ProfileForm() {
  const [titleCount, setTitleCount] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    title: '',
    biography: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    whatsapp: '',
    youtube: '',
    skill1: '',
    skill2: '',
    skill3: '',
    certification1: '',
    certification2: '',
    certification3: '',
  });

  // Single education form
  const [educationForm, setEducationForm] = useState<Education>({
    school: '',
    grade: '',
    degree: '',
    fieldOfStudy: '',
    startDate: new Date(),
    endDate: null,
    currentlyStudying: false,
  });

  // Single experience form
  const [experienceForm, setExperienceForm] = useState<Experience>({
    jobTitle: '',
    companyName: '',
    employmentType: '',
    location: '',
    startDate: new Date(),
    endDate: null,
    currentlyWorking: false,
  });

  const router = useRouterHook();
  const params = useParams();
  const userId = params.id as string;

  // Fetch user data on component mount
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await userService.httpGetCompanyInfo(userId);
        const user = data.user;
        setUserData(user);

        // Set profile picture preview
        setProfilePicPreview(user.socialAvatar || user.avatar || '');

        // Split name into first and last name
        const nameParts = user.name?.split(' ') || [''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Populate form with existing data
        setFormData({
          firstName,
          lastName,
          username: user.socialName || '',
          phone: user.phone || '',
          title: user.tagLine || '',
          biography: user.aboutMe || '',
          website: user.website || '',
          facebook: user.socialLinks?.facebook || '',
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          whatsapp: user.socialLinks?.whatsapp || '',
          youtube: user.socialLinks?.youtube || '',
          skill1: user.skills?.[0] || '',
          skill2: user.skills?.[1] || '',
          skill3: user.skills?.[2] || '',
          certification1: user.certifications?.[0] || '',
          certification2: user.certifications?.[1] || '',
          certification3: user.certifications?.[2] || '',
        });

        // Set title count for character counter
        setTitleCount((user.tagLine || '').length);
      } catch (error) {
        setError('Failed to fetch profile data. Please try again.');
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update title count for title field
    if (name === 'title') {
      setTitleCount(value.length);
    }
  };

  // Handle education form changes
  const handleEducationChange = (field: string, value: any) => {
    setEducationForm((prev) => {
      const updatedForm = {
        ...prev,
        [field]: value,
      };
      // Clear endDate if currentlyStudying is checked
      if (field === 'currentlyStudying' && value) {
        updatedForm.endDate = null;
      }
      return updatedForm;
    });
  };

  // Handle experience form changes
  const handleExperienceChange = (field: string, value: any) => {
    setExperienceForm((prev) => {
      const updatedForm = {
        ...prev,
        [field]: value,
      };
      // Clear endDate if currentlyWorking is checked
      if (field === 'currentlyWorking' && value) {
        updatedForm.endDate = null;
      }
      return updatedForm;
    });
  };

  // Reset education form
  const resetEducationForm = () => {
    setEducationForm({
      school: '',
      grade: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date(),
      endDate: null,
      currentlyStudying: false,
    });
    setEditingEducation(null);
    setIsEditingEducation(false);
  };

  // Reset experience form
  const resetExperienceForm = () => {
    setExperienceForm({
      jobTitle: '',
      companyName: '',
      employmentType: '',
      location: '',
      startDate: new Date(),
      endDate: null,
      currentlyWorking: false,
    });
    setEditingExperience(null);
    setIsEditingExperience(false);
  };

  // Add new education
  const addEducation = () => {
    resetEducationForm();
    setIsEditingEducation(true);
  };

  // Add new experience
  const addExperience = () => {
    resetExperienceForm();
    setIsEditingExperience(true);
  };

  // Edit education
  const editEducation = (edu: Education) => {
    setEducationForm({
      ...edu,
      startDate: dayjs(edu.startDate).toDate(),
      endDate: edu.endDate ? dayjs(edu.endDate).toDate() : null,
    });
    setEditingEducation(edu);
    setIsEditingEducation(true);
  };

  // Edit experience
  const editExperience = (exp: Experience) => {
    setExperienceForm({
      ...exp,
      startDate: dayjs(exp.startDate).toDate(),
      endDate: exp.endDate ? dayjs(exp.endDate).toDate() : null,
    });
    setEditingExperience(exp);
    setIsEditingExperience(true);
  };

  // Save education
  const saveEducation = () => {
    if (!educationForm.school || !educationForm.degree) {
      setError('Please fill in required education fields');
      return;
    }

    setUserData((prev) => {
      if (!prev) return prev;

      const newEducation = [...prev.education];
      if (editingEducation) {
        // Update existing
        const index = newEducation.findIndex(
          (e) => e._id === editingEducation._id
        );
        if (index !== -1) {
          newEducation[index] = { ...educationForm, _id: editingEducation._id };
        }
      } else {
        // Add new
        newEducation.push({ ...educationForm, _id: `temp_${Date.now()}` });
      }

      return { ...prev, education: newEducation };
    });

    resetEducationForm();
  };

  // Save experience
  const saveExperience = () => {
    if (!experienceForm.jobTitle || !experienceForm.companyName) {
      setError('Please fill in required experience fields');
      return;
    }

    setUserData((prev) => {
      if (!prev) return prev;

      const newExperience = [...prev.jobExperience];
      if (editingExperience) {
        // Update existing
        const index = newExperience.findIndex(
          (e) => e._id === editingExperience._id
        );
        if (index !== -1) {
          newExperience[index] = {
            ...experienceForm,
            _id: editingExperience._id,
          };
        }
      } else {
        // Add new
        newExperience.push({ ...experienceForm, _id: `temp_${Date.now()}` });
      }

      return { ...prev, jobExperience: newExperience };
    });

    resetExperienceForm();
  };

  // Delete education
  const deleteEducation = (eduToDelete: Education) => {
    setUserData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: prev.education.filter((edu) => edu._id !== eduToDelete._id),
      };
    });
  };

  // Delete experience
  const deleteExperience = (expToDelete: Experience) => {
    setUserData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        jobExperience: prev.jobExperience.filter(
          (exp) => exp._id !== expToDelete._id
        ),
      };
    });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setError('Image size should be under 1MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfilePic(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);

      // Clear error if any
      setError(null);
    }
  };

  // Remove profile picture
  const removeProfilePic = () => {
    setProfilePic(null);
    setProfilePicPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        socialName: formData.username,
        phone: formData.phone,
        tagLine: formData.title,
        aboutMe: formData.biography,
        website: formData.website,
        socialLinks: {
          linkedin: formData.linkedin,
          youtube: formData.youtube,
          instagram: formData.instagram,
          whatsapp: formData.whatsapp,
          twitter: formData.twitter,
          facebook: formData.facebook,
        },
        jobExperience:
          userData?.jobExperience?.map((exp) => ({
            ...exp,
            startDate:
              exp.startDate instanceof Date
                ? exp.startDate.toISOString()
                : exp.startDate,
            endDate: exp.currentlyWorking
              ? null
              : exp.endDate instanceof Date
                ? exp.endDate.toISOString()
                : exp.endDate,
          })) || [],
        education:
          userData?.education?.map((edu) => ({
            ...edu,
            startDate:
              edu.startDate instanceof Date
                ? edu.startDate.toISOString()
                : edu.startDate,
            endDate: edu.currentlyStudying
              ? null
              : edu.endDate instanceof Date
                ? edu.endDate.toISOString()
                : edu.endDate,
          })) || [],
        skills: [formData.skill1, formData.skill2, formData.skill3].filter(
          (skill) => skill && skill.trim()
        ),
        certifications: [
          formData.certification1,
          formData.certification2,
          formData.certification3,
        ].filter((cert) => cert && cert.trim()),
        socialAvatar: '',
      };

      // Handle profile picture upload if changed
      if (profilePic) {
        const { mediaFiles } = await filesUrlGenerator([profilePic]);
        if (mediaFiles && mediaFiles.length > 0) {
          updateData.socialAvatar = mediaFiles[0].url;
        }
      }

      // const response = await userService.httpUpdateCompanyDetail(updateData);
      router.push(`${Routes.SocialMedia}/profile/${userId}`);
    } catch (error) {
      setError('Failed to save profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" style={{ color: '#007ab6' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6f2f8]">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    className="!text-[#007ab6] hover:underline cursor-pointer"
                    onClick={() => router.push(`${Routes.SocialMedia}`)}
                  >
                    Community
                  </span>
                ),
              },
              {
                title: (
                  <span
                    className="!text-[#007ab6] hover:underline cursor-pointer"
                    onClick={() =>
                      router.push(`${Routes.SocialMedia}/profile/${userId}`)
                    }
                  >
                    Profile
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-[#1d2026] font-medium">
                    Edit Profile
                  </span>
                ),
              },
            ]}
          />
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-md shadow-sm p-8 mb-6">
          {error && (
            <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="">
            <div className="flex-1">
              {/* Account Settings */}
              <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">
                Account Settings
              </h2>

              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="space-y-6 flex-1">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block mb-2 text-[#4e5566]"
                      >
                        Full name
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputComponent
                          name="firstName"
                          placeholder="First name"
                          label=""
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                          }
                        />
                        <InputComponent
                          name="lastName"
                          placeholder="Last name"
                          label=""
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block mb-2 text-[#4e5566]"
                      >
                        Username
                      </label>
                      <InputComponent
                        name="username"
                        placeholder="Enter your username"
                        label=""
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange('username', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-[#4e5566]"
                      >
                        Phone Number
                      </label>
                      <div className="">
                        <PhoneNumberInputWithLable
                          name="phone"
                          placeholder="Your Phone number..."
                          label=""
                          value={formData.phone as any}
                          onChange={(value) =>
                            handleInputChange('phone', value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="bg-[#f5f7fa] p-6 rounded-md flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-[#e9eaf0] flex items-center justify-center relative">
                        {profilePicPreview ? (
                          <>
                            <Image
                              src={profilePicPreview}
                              alt="Profile"
                              fill
                              className="object-cover"
                            />
                            {profilePic && (
                              <button
                                onClick={removeProfilePic}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <CloseCircleOutlined className="h-3 w-3" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-400 text-4xl">📷</div>
                        )}
                      </div>
                      <label
                        htmlFor="profilePic"
                        className="absolute bottom-0 right-0 bg-[#007ab6] text-white p-1 rounded-full cursor-pointer hover:bg-[#005a87]"
                      >
                        <BsUpload className="h-4 w-4" />
                        <input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <div className="text-[#007ab6] text-sm font-medium mb-2">
                      Upload Photo
                    </div>
                    <p className="text-xs text-center text-[#8c94a3]">
                      Image size should be under 1MB and image ratio needs to be
                      1:1
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-[#4e5566]">Title</label>
                    <span className="text-xs text-[#8c94a3]">
                      {titleCount}/50
                    </span>
                  </div>
                  <InputComponent
                    name="title"
                    placeholder="Your title, profession or small biography"
                    label=""
                    type="text"
                    maxLength={50}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="biography"
                    className="block mb-2 text-[#4e5566]"
                  >
                    Biography
                  </label>
                  <TextAreaComponent
                    name="biography"
                    placeholder="Your title, profession or small biography"
                    label=""
                    value={formData.biography}
                    onChange={(e) =>
                      handleInputChange('biography', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Social Profile */}
              <h2 className="text-2xl font-semibold text-[#1d2026] mt-10 mb-6">
                Social Profile
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="website"
                    className="block mb-2 text-[#4e5566]"
                  >
                    Personal Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <BsGlobe className="h-4 w-4 text-[#8c94a3]" />
                    </div>
                    <InputComponent
                      name="website"
                      placeholder="Personal website or portfolio url..."
                      label=""
                      type="text"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="facebook"
                      className="block mb-2 text-[#4e5566]"
                    >
                      Facebook
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                      </div>
                      <InputComponent
                        name="facebook"
                        placeholder="Username"
                        label=""
                        type="text"
                        value={formData.facebook}
                        onChange={(e) =>
                          handleInputChange('facebook', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="instagram"
                      className="block mb-2 text-[#4e5566]"
                    >
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                        </svg>
                      </div>
                      <InputComponent
                        name="instagram"
                        placeholder="Username"
                        label=""
                        type="text"
                        value={formData.instagram}
                        onChange={(e) =>
                          handleInputChange('instagram', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block mb-2 text-[#4e5566]"
                    >
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" />
                          <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" />
                          <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                          />
                        </svg>
                      </div>
                      <InputComponent
                        label=""
                        name="linkedin"
                        type="text"
                        placeholder="Username"
                        value={formData.linkedin}
                        onChange={(e) =>
                          handleInputChange('linkedin', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="twitter"
                      className="block mb-2 text-[#4e5566]"
                    >
                      Twitter
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M22 5.89c-.74.33-1.53.55-2.35.65.85-.5 1.5-1.3 1.8-2.24-.79.47-1.67.8-2.6.99a4.13 4.13 0 0 0-7.1 3.74c-3.4-.17-6.43-1.8-8.46-4.29a4.13 4.13 0 0 0 1.28 5.5c-.68-.02-1.3-.2-1.86-.5v.05a4.13 4.13 0 0 0 3.31 4.05c-.62.17-1.28.2-1.9.07a4.13 4.13 0 0 0 3.85 2.87A8.33 8.33 0 0 1 2 18.53a11.72 11.72 0 0 0 6.34 1.86c7.62 0 11.8-6.3 11.8-11.79v-.54c.8-.58 1.5-1.3 2.05-2.12l-.19-.05z" />
                        </svg>
                      </div>
                      <InputComponent
                        label=""
                        name="twitter"
                        type="text"
                        placeholder="Username"
                        value={formData.twitter}
                        onChange={(e) =>
                          handleInputChange('twitter', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block mb-2 text-[#4e5566]"
                    >
                      Whatsapp
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0011.992 0C5.438 0 .102 5.335.1 11.892c-.001 2.096.546 4.142 1.588 5.945L0 24l6.304-1.654a11.881 11.881 0 005.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.821 11.821 0 00-3.48-8.413z"
                          />
                        </svg>
                      </div>
                      <InputComponent
                        label=""
                        name="whatsapp"
                        type="text"
                        placeholder="Phone number"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          handleInputChange('whatsapp', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="youtube"
                      className="block mb-2 text-[#4e5566]"
                    >
                      Youtube
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-[#007ab6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <InputComponent
                        label=""
                        name="youtube"
                        type="text"
                        placeholder="Username"
                        value={formData.youtube}
                        onChange={(e) =>
                          handleInputChange('youtube', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-8 mt-8">
                {/* Education */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">
                    Education
                  </h2>

                  {/* Education Form */}
                  {isEditingEducation && (
                    <div className="p-4 border-2 border-[#007ab6] rounded-md mb-6 bg-blue-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-[#1d2026]">
                          {editingEducation
                            ? 'Edit Education'
                            : 'Add Education'}
                        </h3>
                        <button
                          onClick={resetEducationForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <CloseCircleOutlined className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            School *
                          </label>
                          <InputComponent
                            label=""
                            name="school"
                            type="text"
                            placeholder="School"
                            value={educationForm.school}
                            onChange={(e) =>
                              handleEducationChange('school', e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-[#4e5566]">
                              Grade
                            </label>
                            <InputComponent
                              label=""
                              name="grade"
                              type="text"
                              placeholder="Grade"
                              value={educationForm.grade}
                              onChange={(e) =>
                                handleEducationChange('grade', e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-[#4e5566]">
                              Degree *
                            </label>
                            <InputComponent
                              label=""
                              name="degree"
                              type="text"
                              placeholder="Degree"
                              value={educationForm.degree}
                              onChange={(e) =>
                                handleEducationChange('degree', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            Field of Study
                          </label>
                          <InputComponent
                            label=""
                            name="fieldOfStudy"
                            type="text"
                            placeholder="Field of Study"
                            value={educationForm.fieldOfStudy}
                            onChange={(e) =>
                              handleEducationChange(
                                'fieldOfStudy',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-[#4e5566]">
                              Start Date
                            </label>
                            <DatePicker
                              value={
                                educationForm.startDate
                                  ? dayjs(educationForm.startDate)
                                  : null
                              }
                              onChange={(date) =>
                                handleEducationChange(
                                  'startDate',
                                  date ? date.toDate() : null
                                )
                              }
                              format="MMM D, YYYY"
                              placeholder="Select start date"
                              className="w-full"
                              suffixIcon={
                                <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                              }
                            />
                          </div>

                          {!educationForm.currentlyStudying && (
                            <div>
                              <label className="block mb-2 text-[#4e5566]">
                                End Date
                              </label>
                              <DatePicker
                                value={
                                  educationForm.endDate
                                    ? dayjs(educationForm.endDate)
                                    : null
                                }
                                onChange={(date) =>
                                  handleEducationChange(
                                    'endDate',
                                    date ? date.toDate() : null
                                  )
                                }
                                format="MMM D, YYYY"
                                placeholder="Select end date"
                                className="w-full"
                                suffixIcon={
                                  <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={educationForm.currentlyStudying}
                            onChange={(e) =>
                              handleEducationChange(
                                'currentlyStudying',
                                e.target.checked
                              )
                            }
                          />
                          <label className="text-sm text-[#4e5566]">
                            I am currently studying here
                          </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <CustomButton
                            text={editingEducation ? 'Update' : 'Add'}
                            className="w-fit"
                            onClick={saveEducation}
                          />
                          <WhiteButton
                            text="Cancel"
                            className="w-fit"
                            onClick={resetEducationForm}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Education Button */}
                  {!isEditingEducation && (
                    <div className="flex justify-center mb-6">
                      <CustomButton
                        text="Add Education"
                        className="w-fit"
                        onClick={addEducation}
                      />
                    </div>
                  )}

                  {/* Education List */}
                  <div className="space-y-4">
                    {userData?.education?.map((edu) => (
                      <div
                        key={edu._id}
                        className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                          <span className="text-xs">
                            {edu.degree?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1d2026]">
                            {edu.degree?.toUpperCase()} -{' '}
                            {edu.fieldOfStudy?.toUpperCase()}
                          </h4>
                          <p className="text-sm text-[#6e7485]">{edu.school}</p>
                          <p className="text-xs text-[#8c94a3]">
                            {new Date(edu.startDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', year: 'numeric' }
                            )}
                            {edu.endDate
                              ? ` - ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                              : ' - Continue'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-[#007ab6] hover:text-[#005a87]"
                            onClick={() => editEducation(edu)}
                          >
                            <EditOutlined className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteEducation(edu)}
                          >
                            <DeleteOutlined className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">
                    Work Experience
                  </h2>

                  {/* Experience Form */}
                  {isEditingExperience && (
                    <div className="p-4 border-2 border-[#007ab6] rounded-md mb-6 bg-blue-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-[#1d2026]">
                          {editingExperience
                            ? 'Edit Experience'
                            : 'Add Experience'}
                        </h3>
                        <button
                          onClick={resetExperienceForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <CloseCircleOutlined className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            Title *
                          </label>
                          <InputComponent
                            label=""
                            name="jobTitle"
                            type="text"
                            placeholder="ex: IT engineer"
                            value={experienceForm.jobTitle}
                            onChange={(e) =>
                              handleExperienceChange('jobTitle', e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            Company or Organization *
                          </label>
                          <InputComponent
                            label=""
                            name="companyName"
                            type="text"
                            placeholder="ex: Schest"
                            value={experienceForm.companyName}
                            onChange={(e) =>
                              handleExperienceChange(
                                'companyName',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            Employment type
                          </label>
                          <InputComponent
                            label=""
                            name="employmentType"
                            type="text"
                            placeholder="ex: full time"
                            value={experienceForm.employmentType || ''}
                            onChange={(e) =>
                              handleExperienceChange(
                                'employmentType',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-[#4e5566]">
                            Location
                          </label>
                          <InputComponent
                            label=""
                            name="location"
                            type="text"
                            placeholder="ex: Egypt"
                            value={experienceForm.location || ''}
                            onChange={(e) =>
                              handleExperienceChange('location', e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-[#4e5566]">
                              Start Date
                            </label>
                            <DatePicker
                              value={
                                experienceForm.startDate
                                  ? dayjs(experienceForm.startDate)
                                  : null
                              }
                              onChange={(date) =>
                                handleExperienceChange(
                                  'startDate',
                                  date ? date.toDate() : null
                                )
                              }
                              format="MMM D, YYYY"
                              placeholder="Select start date"
                              className="w-full"
                              suffixIcon={
                                <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                              }
                            />
                          </div>

                          {!experienceForm.currentlyWorking && (
                            <div>
                              <label className="block mb-2 text-[#4e5566]">
                                End Date
                              </label>
                              <DatePicker
                                value={
                                  experienceForm.endDate
                                    ? dayjs(experienceForm.endDate)
                                    : null
                                }
                                onChange={(date) =>
                                  handleExperienceChange(
                                    'endDate',
                                    date ? date.toDate() : null
                                  )
                                }
                                format="MMM D, YYYY"
                                placeholder="Select end date"
                                className="w-full"
                                suffixIcon={
                                  <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={experienceForm.currentlyWorking}
                            onChange={(e) =>
                              handleExperienceChange(
                                'currentlyWorking',
                                e.target.checked
                              )
                            }
                          />
                          <label className="text-sm text-[#4e5566]">
                            I am currently working in this role
                          </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <CustomButton
                            text={editingExperience ? 'Update' : 'Add'}
                            className="w-fit"
                            onClick={saveExperience}
                          />
                          <WhiteButton
                            text="Cancel"
                            className="w-fit"
                            onClick={resetExperienceForm}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Experience Button */}
                  {!isEditingExperience && (
                    <div className="flex justify-center mb-6">
                      <CustomButton
                        text="Add Work Experience"
                        className="w-fit"
                        onClick={addExperience}
                      />
                    </div>
                  )}

                  {/* Experience List */}
                  <div className="space-y-4">
                    {userData?.jobExperience?.map((job) => (
                      <div
                        key={job._id}
                        className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                          <span className="text-xs">
                            {job.jobTitle?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1d2026]">
                            {job.jobTitle?.toUpperCase()}
                          </h4>
                          <p className="text-sm text-[#6e7485]">
                            {job.companyName}
                          </p>
                          <p className="text-xs text-[#8c94a3]">
                            {new Date(job.startDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', year: 'numeric' }
                            )}
                            {job.endDate
                              ? ` - ${new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                              : ' - Continue'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-[#007ab6] hover:text-[#005a87]"
                            onClick={() => editExperience(job)}
                          >
                            <EditOutlined className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteExperience(job)}
                          >
                            <DeleteOutlined className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Certifications */}
          <div className="flex items-start gap-8 mt-8">
            {/* Skills */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">
                Skills
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="skill1" className="block mb-2 text-[#4e5566]">
                    Skill-1
                  </label>
                  <InputComponent
                    label=""
                    name="skill1"
                    type="text"
                    placeholder="Skill-1"
                    value={formData.skill1}
                    onChange={(e) =>
                      handleInputChange('skill1', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label htmlFor="skill2" className="block mb-2 text-[#4e5566]">
                    Skill-2
                  </label>
                  <InputComponent
                    label=""
                    name="skill2"
                    type="text"
                    placeholder="Skill-2"
                    value={formData.skill2}
                    onChange={(e) =>
                      handleInputChange('skill2', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label htmlFor="skill3" className="block mb-2 text-[#4e5566]">
                    Skill-3
                  </label>
                  <InputComponent
                    label=""
                    name="skill3"
                    type="text"
                    placeholder="Skill-3"
                    value={formData.skill3}
                    onChange={(e) =>
                      handleInputChange('skill3', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">
                Certifications
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="certification1"
                    className="block mb-2 text-[#4e5566]"
                  >
                    Certification-1
                  </label>
                  <InputComponent
                    placeholder="Certification-1"
                    label=""
                    name="certification1"
                    type="text"
                    value={formData.certification1}
                    onChange={(e) =>
                      handleInputChange('certification1', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="certification2"
                    className="block mb-2 text-[#4e5566]"
                  >
                    Certification-2
                  </label>
                  <InputComponent
                    placeholder="Certification-2"
                    label=""
                    name="certification2"
                    type="text"
                    value={formData.certification2}
                    onChange={(e) =>
                      handleInputChange('certification2', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="certification3"
                    className="block mb-2 text-[#4e5566]"
                  >
                    Certification-3
                  </label>
                  <InputComponent
                    placeholder="Certification-3"
                    label=""
                    name="certification3"
                    type="text"
                    value={formData.certification3}
                    onChange={(e) =>
                      handleInputChange('certification3', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-4 mt-10">
            <WhiteButton
              text="Cancel"
              className="!w-fit"
              onClick={() =>
                router.push(`${Routes.SocialMedia}/profile/${userId}`)
              }
            />
            <CustomButton
              text={loading ? 'Saving...' : 'Save'}
              className="!w-fit"
              disabled={loading}
              onClick={handleSaveProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
