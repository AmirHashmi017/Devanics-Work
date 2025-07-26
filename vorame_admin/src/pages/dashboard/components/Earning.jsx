import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  MenuItem,
  Select,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import RadialChart from "components/charts/Radial";
import YearlyReportChart from "components/charts/YearlyReport";
import MonthlyReportChart from "components/charts/MonthlyReport";
import { DASHBOARD_EARNING_REPORT } from "services/constants";
import useApiQuery from "hooks/useApiQuery";
import Loader from "components/Loader";
import Error from "components/Error";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Earning = ({ duration, totalUsers, paidUsers, freeUsers }) => {
  const [reportDuration, setReportDuration] = useState(duration || "year");
  const [reportData, setReportData] = useState(null);
  const [userFilter, setUserFilter] = useState("Paid User");
  const [earningFilter, setEarningFilter] = useState("Active User");

  const durationOptions = {
    month: "Monthly",
    year: "Yearly",
  };

  const {
    isLoading,
    error,
    data: apiResponse,
  } = useApiQuery({
    queryKey: [DASHBOARD_EARNING_REPORT, reportDuration],
    url:
      DASHBOARD_EARNING_REPORT +
      (reportDuration === 'month' ? `/?duration=month` : ""),
  });

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setReportDuration(value);
    setReportData(null);
  };

  const handleUserFilterChange = (e) => {
    setUserFilter(e.target.value);
  };

  const handleEarningFilterChange = (e) => {
    setEarningFilter(e.target.value);
  };

  useEffect(() => {
    setReportDuration(duration);
  }, [duration]);

  useEffect(() => {
    if (apiResponse) {
      setReportData(apiResponse.data.reportData);
    }
  }, [apiResponse]);

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: "24px",
        width: "100%",
        mt: 1,
        p: 2,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Users Chart Section */}
      <Box
        sx={{
          flex: "1 1 0",
          maxWidth: "752px",
          width: "100%",
          border: "1px solid #EAECEE",
          borderRadius: "12px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "12px",
            p: 3,
            height: "100%",
            backgroundColor: "#fff",
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle1" fontWeight={600} color="#1e293b">
              Users
            </Typography>

            {/* User Type Filter */}

            <Box>
              <Stack direction="row" spacing={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "100%",
                      border: "5px solid #222222",
                      backgroundColor: "#222222",
                    }}
                  />
                  <Typography color="#222222">Paid Users</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "100%",
                      border: "5px solid #D3D5DA",
                      backgroundColor: "#D3D5DA",
                    }}
                  />

                  <Typography variant="body2" color="#222222">
                    Free User
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Duration Selector */}
            <Select
              value={reportDuration}
              size="small"
              onChange={handleDurationChange}
              displayEmpty
               IconComponent={KeyboardArrowDownIcon} 
              renderValue={(selected) => {
                if (!selected) return "Monthly";
                return durationOptions[selected];
              }}
              sx={{
                fontSize: "14px",
                minWidth: 120,
                height: "32px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0", // default
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1", // on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0 !important", // override blue on focus
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0 !important",
                  },
                },
              }}
            >
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="year">Yearly</MenuItem>
            </Select>
          </Box>

          <Divider sx={{ mb: 3, backgroundColor: "1px solid #EAECEE" }} />

          {/* Chart Area */}
          <Box sx={{ width: "100%", height: "200px" }}>
            {reportData &&
              (reportDuration === "month" ? (
                <MonthlyReportChart data={reportData} />
              ) : (
                <YearlyReportChart data={reportData} />
              ))}
          </Box>
        </Paper>
      </Box>

      {/* Total Earning Section */}
      <Box
        sx={{
          flex: "1 1 0",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "12px",
            p: 3,
            height: "100%",
            backgroundColor: "#fff",
            border: "1px solid #EAECEE",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="#1a202c"
            mb={3}
          >
            Total Earning
          </Typography>

          {/* Radial Chart Container */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            mb={3}
          >
            <RadialChart
              paidUsers={paidUsers}
              freeUsers={freeUsers}
              totalUsers={totalUsers}
            />
          </Box>

          {/* Bottom Legend Section */}
          <Box>
            <Divider sx={{ mb: 3, backgroundColor: "1px solid #EAECEE" }} />
            <Stack
              direction="row"
              justifyContent="left"
              spacing={4}
              marginLeft={8}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "100%",
                    border: "5px solid #222222",
                    backgroundColor: "#222222",
                  }}
                />
                <Typography color="#222222">Paid Users</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "100%",
                    border: "5px solid #D3D5DA",
                    backgroundColor: "#D3D5DA",
                  }}
                />

                <Typography variant="body2" color="#222222">
                  Trial User
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Earning;
