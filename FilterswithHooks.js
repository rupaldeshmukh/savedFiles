import React, { useState, useEffect } from "react";

const App = () => {
  const initialData = [
    { id: "1", message: "This is message number 1", notification: "Type 1", mark: "good", status: "active" },
    { id: "2", message: "This is message number 2", notification: "Type 1", mark: "bad", status: "active" },
    { id: "3", message: "This is message number 3", notification: "Type 2", mark: "good", status: "inactive" },
    { id: "4", message: "This is message number 4", notification: "Type 1", mark: "bad", status: "active" },
    { id: "5", message: "This is message number 5", notification: "Type 3", mark: "average", status: "inactive" },
    { id: "6", message: "This is message number 5", notification: "Type 3", mark: "bad", status: "active" },
    { id: "7", message: "This is message number 5", notification: "Type 3", mark: "good", status: "inactive" },
    { id: "8", message: "This is message number 5", notification: "Type 4", mark: "bad", status: "active" },
  ];

  const [data, setData] = useState(initialData); // State to hold original data
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [searchText, setSearchText] = useState("");
  const [selectedNotification, setSelectedNotification] = useState("");
  const [selectedMark, setSelectedMark] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [sortType, setSortType] = useState("");

  // useEffect to filter, sort, and paginate the data
  useEffect(() => {
    let updatedData = [...data];

    // Search Filter
    if (searchText) {
      updatedData = updatedData.filter((item) =>
        item.message.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Notification Filter
    if (selectedNotification) {
      updatedData = updatedData.filter(
        (item) => item.notification === selectedNotification
      );
    }

    // Mark Filter
    if (selectedMark) {
      updatedData = updatedData.filter((item) => item.mark === selectedMark);
    }

    // Status Filter
    if (showActiveOnly) {
      updatedData = updatedData.filter((item) => item.status === "active");
    }

    // Sorting
    if (sortType === "alphabetical") {
      updatedData.sort((a, b) => a.message.localeCompare(b.message));
    } else if (sortType === "relevance" && searchText) {
      updatedData.sort((a, b) => {
        const aIncludes = a.message.toLowerCase().includes(searchText.toLowerCase());
        const bIncludes = b.message.toLowerCase().includes(searchText.toLowerCase());
        return bIncludes - aIncludes;
      });
    }

    setFilteredData(updatedData);
    setCurrentPage(1); // Reset to page 1 on filter/sort change
  }, [searchText, selectedNotification, selectedMark, showActiveOnly, sortType, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notification Filters with Sorting and Pagination</h1>

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
          <select value={selectedMark} onChange={(e) => setSelectedMark(e.target.value)}>
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

      {/* Sort Dropdown */}
      <div>
        <label>
          Sort by:{" "}
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="">None</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="relevance">Relevance</option>
          </select>
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
          </select>
        </label>
      </div>

      {/* Filtered and Sorted Data Display */}
      <h2>Filtered Notifications</h2>
      <ul>
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
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
