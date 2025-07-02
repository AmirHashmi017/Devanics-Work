import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const WorldWide = () => {
  const countriesData = [
    { name: "America", percent: 20, color: "#5655D7" },
    { name: "Netherlands", percent: 25, color: "#00997E" },
    { name: "France", percent: 30, color: "#FF414B" },
    { name: "Spain", percent: 35, color: "#FFAE41" },
    { name: "India", percent: 45, color: "#4ABDE8" },
    { name: "Indonesia", percent: 65, color: "#7C8091" },
    { name: "Romania", percent: 85, color: "#465762" },
  ];

  const worldwideCountriesData = [
    { name: "United Kingdom", count: "200", color: "#A8ABB5" },
    { name: "United States", count: "200", color: "#7C8091" },
    { name: "China", count: "200", color: "#51566C" },
    { name: "France", count: "200", color: "#3A4856" },
    { name: "Spain", count: "200", color: "#222222" },
  ];

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
      {/* Left Side - Map Section */}
      <Box
        item
        xs={12}
        md={8}
        sx={{
          flex: "1 1 0",
          maxWidth: "752px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "#FFF",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #EAECEE",
            height: "full",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ mb: 3, color: "#2D3436" }}
          >
            Users
          </Typography>

          {/* Country Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 4,
              gap: 2,
            }}
          >
            {worldwideCountriesData.map(({ name, count, color }, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "100%",
                      border: "6px solid  ",
                      borderColor: color,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#606162", fontSize: "13px" }}
                  >
                    {name}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#2D3436",
                    fontWeight: "600",
                    fontSize: "32px",
                    color: "#606162",
                  }}
                >
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* World Map Placeholder */}
          <Box
            sx={{
              height: "454px",
              objectFit: "cover",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#F1F3F4",
              width: "600px",
            }}
          >
            <img src={`/images/mapImage.png`} alt="upload" />
          </Box>
        </Box>
      </Box>

      {/* Right Side - Countries List */}
      <Box
        item
        xs={12}
        md={4}
        sx={{
          flex: "1 1 0",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            bgcolor: "#FFF",
            padding: "30px",
            height: "fit-content",
            border: "1px solid #EAECEE",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography  fontWeight={500} sx={{ color: "#2D3436", fontSize:"20px"}}>
              Users from Countries
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, backgroundColor: "1px solid #EAECEE" }} />

          {/* Countries List */}
          {countriesData.map(({ name, percent, color }, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ color: "#2D3436" }}
                >
                  {name}
                </Typography>
                <Button
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    padding: "4px 12px",
                    fontWeight: "600",
                    fontSize: "12px",
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                    backgroundColor: color + "20", // Adding transparency
                    color: color,
                  }}
                >
                  {percent}%
                </Button>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: "8px",
                  borderRadius: "10px",
                  bgcolor: "#F1F3F4",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: color,
                    borderRadius: "10px",
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WorldWide;
