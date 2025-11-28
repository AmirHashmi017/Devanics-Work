import { ICommentProps } from '../SingleComment';
import Profile from '../../post/Profile';
import { useNavigate } from 'react-router-dom';

const ReplyComent = ({
  _id,
  content,
  updatedAt,
  associatedCompany,
}: ICommentProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Profile
        name={associatedCompany.name}
        avatar={associatedCompany.avatar}
        date={updatedAt}
        onClick={() => navigate(`/user/${associatedCompany._id}`)}
      />
      <p className="mt-3 text-stormGrey">{content}</p>
    </>
  );
};

export default ReplyComent;
