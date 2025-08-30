import { useLocalStorage } from 'usehooks-ts';

const INVITATION_PLAN = 'INVITATION_PLAN';

// This hook is used to check if the user has visited the invitation plan assigned by the admin
export const useUserInvitationPlanVisited = () => {
  const [data, setData] = useLocalStorage<string | null>(INVITATION_PLAN, null);

  function setValueToStorage(value: string) {
    setData(value);
  }

  return {
    data,
    setValueToStorage,
  };
};
