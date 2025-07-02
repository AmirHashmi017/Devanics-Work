import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { StyledDescription } from "./style";

// Function to truncate the description text
const truncateDescription = (text, limit) => {
  const words = text.split(/\s+/);
  if (words.length <= limit) return text;
  return `${words.slice(0, limit).join(" ")}...`;
};

const DescriptionParser = ({ description, expandedDescriptionId, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (expandedDescriptionId === id) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [expandedDescriptionId, id]);

  const truncatedDescription = truncateDescription(description, 35);

  return (
    <StyledDescription variant="body4" className="custom-clamp-2">
      {parse(isExpanded ? description : truncatedDescription)}
    </StyledDescription>
  );
};

export default DescriptionParser;
