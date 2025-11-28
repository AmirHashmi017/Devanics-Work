import SenaryHeading from 'src/components/Headings/SenaryHeading';
import RevenueReport from './components/RevenueReport';
import Stats from './components/Stats';
import SubscriptionReport from './components/SubscriptionReport';
import Subscriptions from './components/Subscriptions';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import FormControl from 'src/components/FormControl';
import { Form, Formik } from 'formik';
import useApiQuery from 'src/hooks/useApiQuery';
import SkeletonLoader from 'src/components/loader/Skeleton';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { ISubscriptionPieChartReport } from './components/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoading, data: subscriptions } = useApiQuery({
    queryKey: ['subscripiton-plans'],
    url: 'analytics/subscriptions',
    otherOptions: {
      onError(err) {
        const error = err as AxiosError<{ status: number }>;
        if (error.response?.data.status === 401) {
          navigate('/login');
        }
      },
    },
  });

  const initialValues = {
    reportType: 'yearly',
  };

  const subscripitonReport =
    subscriptions?.data as ISubscriptionPieChartReport[];

  return (
    <section className="p-16 py-4 rounded-xl">
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {({ handleSubmit, values }) => {
          return (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-6 gap-x-4 "
            >
              <Stats />
              <div className="w-full grid grid-cols-3">
                <div className="col-span-2 flex justify-between">
                  <TertiaryHeading title="Revenue Report" />
                  <FormControl
                    control="select"
                    name="reportType"
                    className="min-w-[100px]"
                    options={[
                      { label: 'Monthly', value: 'monthly' },
                      { label: 'Yearly', value: 'yearly' },
                    ]}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-3 gap-6">
                <div className="col-span-2 rounded-xl shadow-primaryGlow p-4">
                  <RevenueReport reportType={values.reportType} />
                </div>
                <div className="col-span-1 rounded-xl shadow-primaryGlow">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : (
                    <div>
                      <TertiaryHeading title="Subscriptions" className="p-4" />
                      <SubscriptionReport plans={subscripitonReport || []} />
                      <div className="p-5">
                        {(subscripitonReport || [])
                          .slice(0, 2)
                          .map(({ plan, count, percentage }, i: number) => (
                            <div
                              key={plan._id}
                              className="flex justify-between"
                            >
                              <div className="flex gap-3 items-center">
                                <span
                                  className={`w-3 h-3 ${
                                    i === 0
                                      ? 'bg-midnightBlue2'
                                      : 'bg-lavenderPurple'
                                  }`}
                                />
                                <SenaryHeading title={plan.planName} />
                              </div>
                              <SenaryHeading
                                title={count.toString()}
                                className="font-medium"
                              />
                            </div>
                          ))}
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 bg-goldenrodYellow" />
                            <SenaryHeading title="Most Subscribed Plan" />
                          </div>
                          <SenaryHeading
                            title={
                              subscripitonReport?.[2]?.count.toString() || '0'
                            }
                            className="font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      <Subscriptions />
    </section>
  );
};

export default Dashboard;
