'use client';
import { useEffect, useCallback, useLayoutEffect } from 'react';
import { Spin } from 'antd';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import { estimateRequestService } from '@/app/services/estimates.service';
import { scheduleService } from '@/app/services/schedule.service';
import {
  ActivityItem,
  IWBSType,
} from '@/app/interfaces/schedule/createSchedule.interface';
import { toast } from 'react-toastify';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { HttpService } from '@/app/services/base.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const EstimateSchedule = () => {
  const router = useRouterHook();
  const { estimateId } = useParams();

  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const fetchEstimateScopeDetail = useCallback(
    async (estimateId: string | string[]) => {
      const estimatedScope =
        await estimateRequestService.httpGetGeneratedEstimateDetail(estimateId);

      console.log(estimatedScope, 'estimatedScopeestimatedScope');

      let scheduleProject: any = {
        projectName:
          estimatedScope.data.generatedEstimates?.estimateRequestIdDetail
            .projectName,
        duration: 0,
        durationType: 'days',
        hoursPerDay: 0,
        regularWorkingDays: [],
      };

      scheduleService
        .httpGenerateSchedule(scheduleProject)
        .then((response) => {
          let scheduleObj: any = {
            _id: response.data?.createProject._id,
            projectName: response.data?.createProject.projectName,
            createdAt: response.data?.createProject.createdAt,
            estimateScope: estimatedScope.data.generatedEstimates.estimateScope,
          };
          return scheduleObj;
        })
        .then(async (scheduleObj) => {
          // let finalScheduleDivArray = [];

          for (const estimate of scheduleObj.estimateScope) {
            // let scheduleProjectActivities = [];
            let object: IWBSType = {
              category: estimate.categoryName,
              subCategory: estimate.subCategoryName,
              title: estimate.title,
            };

            const addProjectDiv = await scheduleService.httpAddProjectDiv({
              projectId: scheduleObj._id,
              data: object,
            });

            const createdDiv: any = addProjectDiv.data?.scheduleProjectDiv;

            for (const scopeItem of estimate.scopeItems) {
              const item: ActivityItem = {
                activityCalendar: '',
                activityType: '',
                actualFinish: new Date().toDateString(),
                actualStart: new Date().toDateString(),
                description: scopeItem.description,
                finish: new Date().toDateString(),
                orignalDuration: scopeItem.perHourLaborRate,
                predecessors: '',
                remainingDuration: '',
                start: new Date().toDateString(),
                scheduleCompleted: '',
                status: 'New',
                successors: '',
                totalFloat: '',
              };

              await scheduleService.httpAddProjectDivActivity({
                projectId: scheduleObj._id,
                divId: createdDiv._id,
                data: item,
              });

              // scheduleProjectActivities.push(addProjectDivActivity.data?.newProjectAcitivity);
            }

            // const finalObj = {
            //   _id: createdDiv._id,
            //   title: estimate.title,
            //   category: estimate.title,
            //   subCategory: estimate.title,
            //   scheduleProjectActivities: scheduleProjectActivities,
            //   associatedCompany: estimate.associatedCompany,
            //   associatedProject: createdDiv._id,
            // };

            // // Push the final object to finalScheduleDivArray
            // finalScheduleDivArray.push(finalObj);
          }

          // Return the final array of objects
          // return finalScheduleDivArray;
          return scheduleObj;
        })
        .then((response) => {
          router.push(`/schedule/${response._id}`);
        })
        .catch(() => {
          toast.error('Some thig went wrong');
        });
    },
    []
  );

  useEffect(() => {
    fetchEstimateScopeDetail(estimateId);
  }, [estimateId]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg text-center">
        <Spin size="large" style={{ color: 'red' }} />
        <p className="mt-4">Convert estimate into project schedule </p>
      </div>
    </div>
  );
};

export default EstimateSchedule;
