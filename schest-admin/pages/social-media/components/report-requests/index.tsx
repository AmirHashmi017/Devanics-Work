import { useEffect, useState } from 'react';
import { socialMediaService } from 'src/services/social-media.service';
import { RootState } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import SingleReport, { IReport } from './SingleReport';
import NoData from 'src/components/noData';

const ReportRequest = () => {
  const [postReports, setPostReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchPosts } = useSelector((state: RootState) => state.socialMedia);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const { data } = await socialMediaService.httpGetPostsReports({});
      setPostReports(data.postReports);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return <Skeleton />;
  }
  return (
    <div className="flex flex-col gap-4">
      {postReports.length < 1 ? (
        <NoData title="No Reports Available" displayBtn={false} />
      ) : (
        postReports.map((data) => <SingleReport key={data._id} {...data} />)
      )}
    </div>
  );
};

export default ReportRequest;
