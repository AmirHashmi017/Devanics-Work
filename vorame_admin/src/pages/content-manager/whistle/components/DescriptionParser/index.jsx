import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { StyledDescription } from "./style";

// Function to truncate the description text
const truncateDescription = (html) => {
  const closingPTagIndex = html.indexOf("</p>");
  if (closingPTagIndex === -1) return html;
  return html.slice(0, closingPTagIndex + 4);
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

  const truncatedDescription = truncateDescription(description);

  return (
    <StyledDescription variant="body4">
      {parse(isExpanded ? description : truncatedDescription)}
      {!isExpanded && (
        <span
          onClick={() => setIsExpanded(true)}
          style={{ color: "blue", cursor: "pointer" }}
        ></span>
      )}
    </StyledDescription>
  );
};

export default DescriptionParser;
