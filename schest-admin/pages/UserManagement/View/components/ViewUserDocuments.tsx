import { ShowFile } from 'src/components/File';
import { USER_ROLE_ENUM } from 'src/constants/roles.constants';
import { IGetUserDetail } from 'src/services/user.service';

type Props = {
  data: IGetUserDetail;
};
export function ViewUserDocuments({ data }: Props) {
  if (
    data.userRole === USER_ROLE_ENUM.PROFESSOR ||
    data.userRole === USER_ROLE_ENUM.STUDENT
  ) {
    return (
      <div className="w-60">
        {data.educationalDocuments.map((doc) => {
          return <ShowFile file={doc} key={doc.url} />;
        })}
      </div>
    );
  }

  const docs = data?.verificationsData && Object.values(data.verificationsData);
  if (!docs || docs.length === 0) {
    return null;
  }
  return (
    <div className="grid  grid-cols-3  gap-40">
      {docs.map((doc) => {
        return <ShowFile file={doc} key={doc.url} />;
      })}
    </div>
  );
}
