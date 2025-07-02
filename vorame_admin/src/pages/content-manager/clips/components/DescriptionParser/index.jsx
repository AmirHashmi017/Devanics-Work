import React, { useState, useRef, useEffect } from "react";
import parse from "html-react-parser";
import { StyledDescription } from "./style";
import { Link } from "@mui/material";

const CustomDescriptionParser = ({ description, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsTruncated(
        descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight,
      );
    }
  }, [description, limit]);

  const handleReadMoreClick = () => {
    setIsExpanded(true);
  };

  return (
    <>
      <StyledDescription
        ref={descriptionRef}
        variant="body4"
        limitLines={!isExpanded ? limit : "auto"}
      >
        {parse(description)}
      </StyledDescription>
      {!isExpanded && isTruncated && (
        <Link sx={{ marginTop: "auto" }}>More</Link>
      )}
    </>
  );
};

export default CustomDescriptionParser;
