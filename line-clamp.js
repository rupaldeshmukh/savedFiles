import React, { useState, useRef, useEffect } from "react";

const LineClampWithShowMore = ({ text, maxLines = 2 }) => {
  const [isOverflowing, setIsOverflowing] = useState(false); // Checks if text exceeds 2 lines
  const [expanded, setExpanded] = useState(false); // Toggles between expanded/collapsed
  const textRef = useRef(null); // Reference to measure the text container

  useEffect(() => {
    // Measure if the text exceeds the clamped height
    const checkOverflow = () => {
      if (textRef.current) {
        const maxHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) * maxLines;
        setIsOverflowing(textRef.current.scrollHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow); // Re-check on window resize
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text, maxLines]);

  // Styles for clamped text
  const clampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: expanded ? "unset" : maxLines,
    WebkitBoxOrient: "vertical",
    overflow: expanded ? "visible" : "hidden",
    textOverflow: "ellipsis",
    lineHeight: "1.5em", // Adjust as per your design
    maxHeight: expanded ? "none" : `${1.5 * maxLines}em`,
  };

  return (
    <div style={{ position: "relative", width: "300px" }}> {/* Adjust width as needed */}
      <span ref={textRef} style={clampStyle}>
        {text}
      </span>
      {isOverflowing && ( // Show "show more" only if text overflows
        <span
          onClick={() => setExpanded(!expanded)}
          style={{
            color: "#e20074",
            cursor: "pointer",
            fontWeight: "bold",
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            paddingLeft: "5px",
          }}
        >
          {expanded ? " show less" : "... show more"}
        </span>
      )}
    </div>
  );
};

export default LineClampWithShowMore;
