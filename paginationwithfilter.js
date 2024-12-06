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
    { id: "9", message: "This is message number 6", notification: "Type 4", mark: "good", status: "active" },
    { id: "10", message: "This is message number 7", notification: "Type 4", mark: "good", status: "active" },
  ];

  const [searchText, setSearchText] = useState(""); // For search filter
  const [selectedNotification, setSelectedNotification] = useState(""); // For notification filter
  const [selectedMark, setSelectedMark] = useState(""); // For mark filter
  const [showActiveOnly, setShowActiveOnly] = useState(false); // For status filter
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage, setItemsPerPage] = useState(3); // Items per page

  // Filter data based on all active filters
  const filteredData = data.filter((item) => {
    const matchesSearch = item.message.toLowerCase().includes(searchText.toLowerCase());
    const matchesNotification = selectedNotification
      ? item.notification === selectedNotification
      : true;
    const matchesMark = selectedMark ? item.mark === selectedMark : true;
    const matchesStatus = showActiveOnly ? item.status === "active" : true;

    return matchesSearch && matchesNotification && matchesMark && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handlers for pagination
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  // Handler for items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notification Filters with Pagination</h1>

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

      {/* Items per page */}
      <div>
        <label>
          Items Per Page:{" "}
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
      </div>

      {/* Filtered Data Display */}
      <h2>Filtered Notifications</h2>
      <ul>
        {currentData.length > 0 ? (
          currentData.map((item) => (
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

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px" }}>
        <button disabled={currentPage === 1} onClick={goToPreviousPage}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            style={{
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
