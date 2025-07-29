import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";

const WorldWide = ({ statsData, duration }) => {
  // Extract data from API response
  const totalUsers = statsData?.data?.totalUsers || 0;
  const countryStats = statsData?.data?.countryStats || [];

  // Colors for different countries
  const colors = [
    "#5655D7", "#00997E", "#FF414B", "#FFAE41", "#4ABDE8", 
    "#7C8091", "#465762", "#A8ABB5", "#51566C", "#3A4856"
  ];

  // Sort countries by total users (descending)
  const sortedCountries = countryStats
    .slice() // avoid mutating original
    .sort((a, b) => b.totalUsers - a.totalUsers);

  // Calculate percentages for each country
  const countriesWithPercentages = sortedCountries.map((country, index) => {
    const percentage = totalUsers > 0 ? Math.round((country.totalUsers / totalUsers) * 100) : 0;
    return {
      ...country,
      percent: percentage,
      color: colors[index % colors.length]
    };
  });

  // State for load more
  const [showAll, setShowAll] = useState(false);
  const top7 = countriesWithPercentages.slice(0, 7);
  const rest = countriesWithPercentages.slice(7);
  const countriesToShow = showAll ? countriesWithPercentages : top7;

  // Take top 5 for the map section
  const top5Countries = countriesWithPercentages.slice(0, 5);

  // Duration label
  const durationLabel = duration === 'month' ? 'Last month' : 'Last year';

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
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ color: "#2D3436" }}
            >
              Users
            </Typography>
            <Typography variant="body2" color="#858688">
              {durationLabel}
            </Typography>
          </Box>

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
            {top5Countries.map(({ countryName, totalUsers: countryUsers, color }, i) => (
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
                    {countryName}
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
                  {countryUsers}
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
            <Typography fontWeight={500} sx={{ color: "#2D3436", fontSize: "20px" }}>
              Users from Countries
            </Typography>
            <Typography variant="body2" color="#858688">
              {durationLabel}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, backgroundColor: "1px solid #EAECEE" }} />

          {/* Countries List */}
          {countriesToShow.map(({ countryName, percent, color, totalUsers: countryUsers }, i) => (
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
                  {countryName}
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

          {/* Load More Button */}
          {rest.length > 0 && !showAll && (
            <Box textAlign="center" mt={2}>
              <Button variant="outlined" onClick={() => setShowAll(true)}>
                Load More
              </Button>
            </Box>
          )}
          {rest.length > 0 && showAll && (
            <Box textAlign="center" mt={2}>
              <Button variant="outlined" onClick={() => setShowAll(false)}>
                Show Less
              </Button>
            </Box>
          )}

          
        </Box>
      </Box>
    </Box>
  );
};

export default WorldWide;
