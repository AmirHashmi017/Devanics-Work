import React, { useState, useRef, useEffect } from "react";
import parse from "html-react-parser";
import { Typography, Box } from "@mui/material";

const CustomDescriptionParser = ({
  description,
  limit = 3,
  color = "#666",
  fontsize = "14px",
  fontWeight = 400,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el && !expanded) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || 0);
      const maxHeight = lineHeight * limit;
      if (el.scrollHeight > maxHeight) {
        setShowToggle(true);
      }
    }
  }, [description, expanded, limit]);

  return (
    <Box>
      <Typography
        ref={contentRef}
        sx={{
          fontSize: fontsize,
          fontWeight: fontWeight,
          color: color,
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : limit,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {parse(description)}
      </Typography>

      {showToggle && (
        <Typography
          onClick={() => setExpanded(!expanded)}
          sx={{
            mt: 2,
            fontSize: "13px",
            color: "#555",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline",
            display: "inline-block",
          }}
        >
          {expanded ? "Less" : "More"}
        </Typography>
      )}
    </Box>
  );
};

export default CustomDescriptionParser;
