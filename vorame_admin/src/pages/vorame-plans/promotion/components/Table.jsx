import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SinglePromoRow from "./SinglePromoRow";
import useApiQuery from "hooks/useApiQuery";
import { PROMO } from "services/constants";
import Loader from "components/Loader";
import NoData from "components/NoData";

export default function PromosTable({
  searchTerm,
  limit,
  offset,
  setTotal,
  plansMap,
}) {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useApiQuery({
    queryKey: ["promos", limit, offset, searchTerm],
    url: PROMO + `list?searchTerm=${searchTerm}&offset=${offset}&limit=${limit}`,
    searchTerm,
    otherOptions: {
      onSuccess: ({data}) => {
        setTotal(data.total || data.length);
      },
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <TableContainer component={Paper}
       sx={{
        borderRadius: "12px",
        boxShadow: "none",
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
            <TableCell sx={{ fontWeight: 400, p: 1.3 }}>Promo Code</TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Discount
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Applied To
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Start Date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Expiry Date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 400, p: 1.3 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiResponse.data.length > 0 ? apiResponse.data
            .slice(offset, offset + limit)
            .map((promoData) => (
              <SinglePromoRow key={promoData._id} {...promoData} plansMap={plansMap} />
            )) : <TableCell colSpan={7}><NoData/></TableCell>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
