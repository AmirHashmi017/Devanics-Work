import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SingleUser from "./SingleUser";
import useApiQuery from "hooks/useApiQuery";
import { USER } from "services/constants";
import Loader from "components/Loader";
import NoData from "components/NoData";

export default function UserManagementTable({
  searchTerm,
  limit,
  offset,
  setTotal,
}) {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useApiQuery({
    queryKey: ["users", limit, offset, searchTerm],
    url: USER + `list?searchTerm=${searchTerm}&offset=${offset}&limit=${limit}`,
    searchTerm,
    otherOptions: {
      onSuccess: ({data}) => {
      setTotal(data.total)
      },
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <TableContainer component={Paper}
       sx={{
        borderRadius: "12px",
        boxShadow: "none !important",
        border: "1px solid #ECECEC",
      }}>
      <Table
        sx={{
          minWidth: 850,
          border: "1px solid #ECECEC",
          borderRadius: "12px !important", 
          overflowX: 'auto',
          shadow: "none !important",
        }}
      >
        <TableHead sx={{ bgcolor: "#F4F7FA", }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 400, fontSize:"14px", p: 1.3 }}>Subject</TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Category
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Username
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Created Date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiResponse.data.users.length>0?apiResponse.data.users.map((userData) => (
            <SingleUser key={userData._id} {...userData} />
          )): <TableCell colSpan={7}><NoData/></TableCell>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
