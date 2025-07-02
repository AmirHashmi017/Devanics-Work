import React from "react";
import { useQuery } from "react-query";
import { LoungeList } from "./components";
import LoungeApi from "../../../services/api/lounge";
import { CustomLoader } from "../../../components";

const Lounge = () => {
  // Get lounge List
  const {
    data: loungeData,
    isLoading: loungeLoading,
    refetch: refetchLounge,
  } = useQuery("LOUNGE_LIST", () => LoungeApi.getLounges());

  return (
    <div>
      {loungeLoading ? (
        <CustomLoader />
      ) : (
        <LoungeList data={loungeData} refetch={refetchLounge} />
      )}
    </div>
  );
};

export default Lounge;
