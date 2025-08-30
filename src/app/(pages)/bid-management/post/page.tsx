'use client';
import Description from '@/app/component/description';
import { withAuth } from '@/app/hoc/withAuth';
import { ConfigProvider, Steps, type StepsProps } from 'antd';
import Image from 'next/image';
import { PostBasicInformation } from './components/BasicInformation';
import { PostProjectFooter } from './components/Footer';
import { PostProjectDetails } from './components/ProjectDetails';
import { PostDesignTeam } from './components/DesignTeam';
import { PostProjectTrades } from './components/ProjectTrades';
import { ProjectUploadFiles } from './components/ProjectFile';
import { PostFinalize } from './components/PostFinalize';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import {
  CreateOwnerPostProjectType,
  bidManagementService,
} from '@/app/services/bid-management.service';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  resetPostProjectAction,
  setFormStepAction,
  setPostProjectAction,
} from '@/redux/post-project/post-project.slice';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type { RcFile, UploadFile } from 'antd/es/upload';
import { Routes } from '@/app/utils/plans.utils';
import { useState } from 'react';
import { PostProjectCongratulations } from './components/PostProjectCongratulations';
import { ShouldHaveAtLeastCharacterRegex } from '@/app/utils/regex.util';
import { useRouterHook } from '@/app/hooks/useRouterHook';

// import { DeletePopup } from './components/DeletePopup';
// import { PostProjectCongratulations } from './components/PostProjectCongratuslations';

const BasicInformationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Address cannot be empty',
    })
    .required('Address is required'),
  city: Yup.string().required('City is required'),
  constructionTypes: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Construction Type is required')
    .required('Construction Type is required'),
  country: Yup.string().required('Country is required'),
  projectName: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'Project name cannot be empty',
    })
    .required('Project Name is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip Code is required'),
  status: Yup.string().required('Status is required'),
});

const ProjectDetailsSchema = Yup.object().shape({
  projectType: Yup.array()
    .of(Yup.string().required('Project Type is required'))
    .min(1, 'At least one Project Type is required')
    .required('Project Type is required'),
  projectBuildingUse: Yup.array()
    .of(Yup.string().required('Project Building Use is required'))
    .min(1, 'At least one Project Building Use is required')
    .required('Project Building Use is required'),
  stage: Yup.string().min(1).required('Stage is required'),
  estimatedStartDate: Yup.string().required('Estimated Start Date is required'),
  estimatedDuration: Yup.string().required('Estimated Duration is required'),
  durationType: Yup.mixed()
    .oneOf(['days', 'weeks', 'months', 'years'])
    .required('Duration Type is required'),
  description: Yup.string()
    .min(1)
    .test({
      test: (value) => {
        if (!value) return true; // Allow empty values, adjust if necessary
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 300;
      },
      message: 'Description should not exceed 300 words',
    })
    .required('Description is required'),
  specialInstructions: Yup.string(),
  bidDueDate: Yup.string().min(1).required('Bid Due Date is required'),
  estimatedCompletionDate: Yup.string().required(
    'Estimated Completion Date is required'
  ),
  squareFootage: Yup.string().min(1).optional(),
  projectValue: Yup.number().min(1).required('Project Value is required'),
});

const DesignTeamSchema = Yup.object().shape({
  teamMembers: Yup.array().of(Yup.string()),
});

const TradesSchema = Yup.object().shape({
  selectedTrades: Yup.array().of(Yup.string()),
});

const FilesSchema = Yup.object().shape({
  projectFiles: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().required('Url is required'),
      extension: Yup.string().required('Extension is required'),
      type: Yup.string().required('Type is required'),
      name: Yup.string().required('Name is required'),
    })
  ),
});

const onsiteMeetingSchema = Yup.object().shape({
  isChecked: Yup.boolean(),
  type: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Type is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  location: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Location is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  date: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Date is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  time: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Time is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  instruction: Yup.string().when('isChecked', {
    is: true,
    then: () =>
      Yup.string()
        .test({
          test: (value) => {
            if (!value) return true; // Allow empty values, adjust if necessary
            const wordCount = value.trim().split(/\s+/).length;
            return wordCount <= 50;
          },
          message: 'Additional details should not exceed 50 words',
        })
        .required('Instruction is required'),
    otherwise: () => Yup.string().notRequired(),
  }),
  isMandatory: Yup.boolean(),
});

const onlineMeetingSchema = Yup.object().shape({
  isChecked: Yup.boolean(),
  // if isChecked is true then type is required
  type: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Type is required'),
    otherwise: () => Yup.string().notRequired(),
  }),

  meeting: Yup.mixed().when('isChecked', {
    is: true,
    then: () => Yup.mixed().required('Meeting is required'),
    otherwise: () => Yup.mixed().notRequired(),
  }),
  isMandatory: Yup.boolean(),
});

const FinalizeProjectSchema = Yup.object().shape({
  status: Yup.mixed()
    .oneOf(['draft', 'archived', 'expired', 'active'])
    .required('Status is required'),
  isMatchingWithTrades: Yup.boolean().required(
    'Matching with trades is required'
  ),
  sendInMyNetwork: Yup.boolean().required('Send in my network is required'),
  invitedMembers: Yup.array().of(Yup.string().email('is invalid email')),
  invitedMembersAssets: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      url: Yup.string().required('Url is required'),
      extension: Yup.string().required('Extension is required'),
      type: Yup.string().required('Type is required'),
    })
  ),
  selectedTeamMembers: Yup.array().of(Yup.string()),
  platformType: Yup.string().required('Platform Type is required'),
  preBiddingMeeting: Yup.lazy((value) => {
    if (!value || !value.isChecked) return Yup.mixed().notRequired();
    if (value.type === 'Onsite') return onsiteMeetingSchema;
    if (value.type === 'Online') return onlineMeetingSchema;
    return Yup.mixed().notRequired();
  }),
  siteWalkthrough: Yup.object().shape({
    isChecked: Yup.boolean(),
    location: Yup.string().when('isChecked', {
      is: true,
      then: () => Yup.string().required('Location is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    date: Yup.string().when('isChecked', {
      is: true,
      then: () => Yup.string().required('Date is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    time: Yup.string().when('isChecked', {
      is: true,
      then: () => Yup.string().required('Time is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    instruction: Yup.string().when('isChecked', {
      is: true,
      then: () =>
        Yup.string()
          .test({
            test: (value) => {
              if (!value) return true; // Allow empty values, adjust if necessary
              const wordCount = value.trim().split(/\s+/).length;
              return wordCount <= 50;
            },
            message: 'Additional details should not exceed 50 words',
          })
          .required('Instruction is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    isMandatory: Yup.boolean(),
  }),
  rfiDeadline: Yup.object().shape({
    isChecked: Yup.boolean(),
    date: Yup.string().when('isChecked', {
      is: true,
      then: () => Yup.string().required('Date is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    time: Yup.string().when('isChecked', {
      is: true,
      then: () => Yup.string().required('Time is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
  }),
});

function StaticTime({ minutes = 1 }: { minutes?: number }) {
  return (
    <div className="flex items-center space-x-2">
      <Image src={'/clock.svg'} height={10} width={10} alt="clock" />
      <Description
        title={`${minutes} Minute${minutes > 1 ? 's' : ''}`}
        className="text-[#98A2B3] text-xs"
      />
    </div>
  );
}
let stepItems: StepsProps['items'] = [
  {
    title: <h4>Basic Information</h4>,
    description: <StaticTime />,
    className: 'mt-5',
  },
  {
    title: <h4>Project Details</h4>,
    description: <StaticTime />,
    className: 'mt-5',
  },
  {
    title: <h4>Team</h4>,
    description: <StaticTime />,
    className: 'mt-5',
  },
  {
    title: <h4>Trades</h4>,
    description: <StaticTime />,
    className: 'mt-5',
  },
  {
    title: <h4>Project file</h4>,
    description: <StaticTime minutes={2} />,
    className: 'mt-5',
  },
  {
    title: <h4>Finalize</h4>,
    description: <StaticTime />,
    className: 'mt-5',
  },
];

export type PostProjectFileProps = (RcFile | UploadFile) & {
  uploading: boolean;
  fileUrl: string;
};

function CreatePost() {
  const [showCongratulation, setShowCongratulation] = useState(false);
  const postProjectState = useSelector((state: RootState) => state.postProject);
  const router = useRouterHook();
  const [shouldContinue, setShouldContinue] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const nextStep = () => {
    dispatch(setFormStepAction(postProjectState.formStep + 1));
  };

  const prevStep = () => {
    dispatch(setFormStepAction(postProjectState.formStep - 1));
  };

  const createProjectMutation = useMutation<
    IResponseInterface<{ createdProject: IBidManagement }>,
    AxiosError<{ message: string }>,
    CreateOwnerPostProjectType
  >({
    mutationFn: (values: CreateOwnerPostProjectType) =>
      bidManagementService.httpCreateBidPostProject(values),
    onSuccess(res) {
      console.log('Create Project Data', res);
      if (res.data && res.data.createdProject) {
        dispatch(setPostProjectAction(res.data.createdProject));
        nextStep();
      }
    },
    onError(error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const updateProjectMutation = useMutation<
    IResponseInterface<{ updatedProject: IBidManagement }>,
    AxiosError<{ message: string }>,
    Partial<IBidManagement>
  >({
    mutationKey: 'update-post-project',
    mutationFn: (values) =>
      bidManagementService.httpUpdateBidPostProject(
        postProjectState.project?._id || '',
        values
      ),
    onSuccess(res) {
      if (res.data && res.data.updatedProject) {
        if (postProjectState.formStep === 5) {
          dispatch(setPostProjectAction(res.data.updatedProject));
          setShowCongratulation(true);
        } else {
          dispatch(setPostProjectAction(res.data.updatedProject));
          nextStep();
        }
      }
    },
    onError(error) {
      console.log('Update Project Mutation', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const basicInformationFormik = useFormik({
    initialValues: postProjectState.project
      ? {
          ...postProjectState.project,
        }
      : {
          projectName: '',
          country: 'US',
          city: '',
          zipCode: '',
          state: '',
          constructionTypes: [] as string[],
          address: '',
          status: 'draft' as CreateOwnerPostProjectType['status'],
        },
    onSubmit(values) {
      if (postProjectState.project) {
        updateProjectMutation.mutate(values);
      } else {
        createProjectMutation.mutate(values);
      }
    },
    validationSchema: BasicInformationSchema,
    enableReinitialize: true,
  });

  const mainFormik = useFormik<IBidManagement>({
    initialValues: {
      ...(postProjectState.project as IBidManagement),
      preBiddingMeeting: {
        isChecked:
          (postProjectState.project as IBidManagement)?.preBiddingMeeting
            ?.isChecked || false,
        type:
          (postProjectState.project as IBidManagement)?.preBiddingMeeting
            ?.type || 'Online',
        ...(postProjectState.project as IBidManagement)?.preBiddingMeeting,
      },
      siteWalkthrough: {
        ...(postProjectState.project as IBidManagement)?.siteWalkthrough,
        isChecked:
          (postProjectState.project as IBidManagement)?.siteWalkthrough
            ?.isChecked || false,
      },
      rfiDeadline: {
        ...(postProjectState.project as IBidManagement)?.rfiDeadline,
        isChecked:
          (postProjectState.project as IBidManagement)?.rfiDeadline
            ?.isChecked || false,
      },
      isMatchingWithTrades:
        (postProjectState.project as IBidManagement)?.isMatchingWithTrades ||
        true,
    },
    onSubmit(values) {
      updateProjectMutation.mutate(values);
    },
    validationSchema:
      postProjectState.formStep === 1
        ? ProjectDetailsSchema
        : postProjectState.formStep === 2
          ? DesignTeamSchema
          : postProjectState.formStep === 3
            ? TradesSchema
            : postProjectState.formStep === 4
              ? FilesSchema
              : postProjectState.formStep === 5
                ? FinalizeProjectSchema
                : undefined,
    enableReinitialize: true,
  });

  return (
    <section className="mt-6 mb-[39px] mx-4 rounded-xl ">
      <div className="flex gap-4 items-center">
        <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description title="Project" className="font-base text-slateGray" />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <Description
          title="Post Project"
          className="font-semibold text-schestiPrimary cursor-pointer underline"
        />
      </div>
      {showCongratulation ? (
        <PostProjectCongratulations
          cancelBtn={{
            text: 'View Project',
            onClick() {
              const id = postProjectState.project?._id;
              if (id) {
                router.push(
                  `${Routes['Bid Management'].Posted_Projects}/view/${id}`
                );
                dispatch(resetPostProjectAction());
              }
            },
          }}
          confirmBtn={{
            text: 'Project Dashboard',
            onClick() {
              router.push(`${Routes['Bid Management'].Posted_Projects}`);
              dispatch(resetPostProjectAction());
            },
          }}
          text="Your project has been posted successfully"
          title="Congratulations!"
        />
      ) : null}
      {/* <DeletePopup /> */}
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-3 bg-white shadow-[0_4px_30px_0px_#2E2D740D] border rounded-xl p-4 h-fit">
          <ConfigProvider
            theme={{
              components: {
                Steps: {
                  dotSize: 18,
                  dotCurrentSize: 18,
                  colorPrimary: '#007AB6',
                  colorText: '#007AB6',
                  fontWeightStrong: 600,
                  fontSize: 16,
                  lineHeight: 16,
                },
              },
            }}
          >
            <Steps
              progressDot
              current={postProjectState.formStep}
              direction="vertical"
              size="default"
              items={stepItems}
            />
          </ConfigProvider>
        </div>
        <div className="col-span-9">
          {postProjectState.formStep === 0 ? (
            <PostBasicInformation formik={basicInformationFormik}>
              <PostProjectFooter
                cancelButton={{
                  text: 'Cancel',
                  onClick() {
                    router.push(`${Routes['Bid Management'].Posted_Projects}`);
                    dispatch(resetPostProjectAction());
                  },
                }}
                submitButton={{
                  onClick() {
                    basicInformationFormik.submitForm();
                  },
                  text: postProjectState.project
                    ? 'Update & Continue'
                    : 'Save & Continue',
                  loading:
                    createProjectMutation.isLoading ||
                    updateProjectMutation.isLoading,
                }}
                info={{
                  title: `0% Completed`,
                  description: 'Welcome to the project post screens',
                }}
              />
            </PostBasicInformation>
          ) : postProjectState.formStep === 1 ? (
            <PostProjectDetails formik={mainFormik}>
              <PostProjectFooter
                cancelButton={{
                  text: 'Previous',
                  onClick() {
                    prevStep();
                  },
                }}
                submitButton={{
                  async onClick() {
                    mainFormik.handleSubmit();
                  },
                  text: 'Save & Continue',
                  loading: updateProjectMutation.isLoading,
                }}
                info={{
                  title: `25% Completed`,
                  description: 'You’re almost done! Just 4 step left',
                }}
              />
            </PostProjectDetails>
          ) : postProjectState.formStep === 2 ? (
            <PostDesignTeam formik={mainFormik}>
              <PostProjectFooter
                cancelButton={{
                  text: 'Previous',
                  onClick() {
                    prevStep();
                  },
                }}
                submitButton={{
                  onClick() {
                    mainFormik.handleSubmit();
                  },
                  text: 'Save & Continue',
                  loading: updateProjectMutation.isLoading,
                }}
              />
            </PostDesignTeam>
          ) : postProjectState.formStep === 3 ? (
            <PostProjectTrades formik={mainFormik}>
              <PostProjectFooter
                cancelButton={{
                  text: 'Previous',
                  onClick() {
                    prevStep();
                  },
                }}
                submitButton={{
                  onClick() {
                    mainFormik.handleSubmit();
                  },
                  text: 'Save & Continue',
                  loading: updateProjectMutation.isLoading,
                }}
                info={{
                  title: `75% Completed`,
                  description: 'You’re almost done! Just 2 step left',
                }}
              />
            </PostProjectTrades>
          ) : postProjectState.formStep === 4 ? (
            <ProjectUploadFiles
              formik={mainFormik}
              setShouldContinue={setShouldContinue}
            >
              <PostProjectFooter
                cancelButton={{
                  text: 'Previous',
                  onClick() {
                    if (!shouldContinue) {
                      toast.error('Please wait for the files to upload');
                      return;
                    }
                    prevStep();
                  },
                }}
                submitButton={{
                  onClick() {
                    if (!shouldContinue) {
                      toast.error('Please wait for the files to upload');
                      return;
                    }
                    mainFormik.handleSubmit();
                  },
                  text: 'Upload & Continue',
                  loading: updateProjectMutation.isLoading,
                }}
                info={{
                  title: `90% Completed`,
                  description: 'You’re almost done! Just 1 step left',
                }}
              />
            </ProjectUploadFiles>
          ) : postProjectState.formStep === 5 ? (
            <PostFinalize formik={mainFormik}>
              <PostProjectFooter
                cancelButton={{
                  text: 'Previous',
                  onClick() {
                    prevStep();
                  },
                }}
                submitButton={{
                  onClick() {
                    if (mainFormik.values.status === 'draft') {
                      mainFormik.setFieldValue('status', 'active');
                    }
                    if (mainFormik.errors.status) {
                      toast.error('Cannot update the status');
                    }

                    mainFormik.handleSubmit();
                  },
                  text:
                    mainFormik.values.status === 'active'
                      ? 'Update Project'
                      : updateProjectMutation.isLoading
                        ? 'Posting'
                        : 'Post Project',
                  loading: updateProjectMutation.isLoading,
                }}
                info={{
                  title: `100% Completed`,
                  description: 'You’re almost done! Post your project now',
                }}
              />
            </PostFinalize>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default withAuth(CreatePost);
