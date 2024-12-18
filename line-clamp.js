import React, { useState } from "react";

const LineClampWithSeeMore = ({ text, maxLines = 2 }) => {
  const [expanded, setExpanded] = useState(false); // State to toggle between expanded/collapsed

  // Toggle text expansion
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Styles for the clamped text
  const clampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: expanded ? "unset" : maxLines, // Unset the clamp when expanded
    WebkitBoxOrient: "vertical",
    overflow: expanded ? "visible" : "hidden",
    textOverflow: "ellipsis",
    lineHeight: "1.5em", // Adjust line height
    maxHeight: expanded ? "none" : `${1.5 * maxLines}em`, // Ensure height matches the clamping
  };

  return (
    <div style={{ position: "relative", width: "300px" }}> {/* Adjust width as needed */}
      <span style={clampStyle}>{text}</span>
      <span
        onClick={toggleExpanded}
        style={{
          color: "#e20074", // Link color
          cursor: "pointer",
          fontWeight: "bold",
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "white", // Optional: Matches the background for clear readability
          paddingLeft: "5px",
        }}
      >
        {expanded ? " see less" : "... see more"}
      </span>
    </div>
  );
};

export default LineClampWithSeeMore;
