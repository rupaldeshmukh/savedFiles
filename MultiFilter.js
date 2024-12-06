import React, { useState } from "react";

const App = () => {
  const data = [
    { id: "1", message: "This is message number 1", notification: "Type 1", mark: "good", status: "active" },
    { id: "2", message: "This is message number 2", notification: "Type 1", mark: "bad", status: "active" },
    { id: "3", message: "This is message number 3", notification: "Type 2", mark: "good", status: "inactive" },
    { id: "4", message: "This is message number 4", notification: "Type 1", mark: "bad", status: "active" },
    { id: "5", message: "This is message number 5", notification: "Type 3", mark: "average", status: "inactive" },
    { id: "6", message: "This is message number 5", notification: "Type 3", mark: "bad", status: "active" },
    { id: "7", message: "This is message number 5", notification: "Type 3", mark: "good", status: "inactive" },
    { id: "8", message: "This is message number 5", notification: "Type 4", mark: "bad", status: "active" },
  ];

  const [searchText, setSearchText] = useState(""); // For search filter
  const [selectedNotification, setSelectedNotification] = useState(""); // For notification filter
  const [selectedMark, setSelectedMark] = useState(""); // For mark filter
  const [showActiveOnly, setShowActiveOnly] = useState(false); // For status filter

  // Filter data based on all active filters
  const filteredData = data.filter((item) => {
    // Check if the message includes the search text
    const matchesSearch = item.message.toLowerCase().includes(searchText.toLowerCase());

    // Check if the notification matches the selected notification (if any)
    const matchesNotification = selectedNotification
      ? item.notification === selectedNotification
      : true;

    // Check if the mark matches the selected mark (if any)
    const matchesMark = selectedMark ? item.mark === selectedMark : true;

    // Check if the status is "active" (if the "show active only" filter is active)
    const matchesStatus = showActiveOnly ? item.status === "active" : true;

    return matchesSearch && matchesNotification && matchesMark && matchesStatus;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Advanced Notification Filters</h1>

      {/* Search Input */}
      <div>
        <label>
          Search Messages:{" "}
          <input
            type="text"
            placeholder="Search messages..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>
      </div>

      {/* Notification Filter Dropdown */}
      <div>
        <label>
          Filter by Notification Type:{" "}
          <select
            value={selectedNotification}
            onChange={(e) => setSelectedNotification(e.target.value)}
          >
            <option value="">All Notifications</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="Type 3">Type 3</option>
            <option value="Type 4">Type 4</option>
          </select>
        </label>
      </div>

      {/* Mark Filter Dropdown */}
      <div>
        <label>
          Filter by Mark:{" "}
          <select
            value={selectedMark}
            onChange={(e) => setSelectedMark(e.target.value)}
          >
            <option value="">All Marks</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="average">Average</option>
          </select>
        </label>
      </div>

      {/* Status Filter Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          Show Active Only
        </label>
      </div>

      {/* Filtered Data Display */}
      <h2>Filtered Notifications</h2>
      <ul>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <li key={item.id}>
              <strong>Message:</strong> {item.message} |{" "}
              <strong>Notification:</strong> {item.notification} |{" "}
              <strong>Mark:</strong> {item.mark} | <strong>Status:</strong>{" "}
              {item.status}
            </li>
          ))
        ) : (
          <p>No matching notifications found.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
