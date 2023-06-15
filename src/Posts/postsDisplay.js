import React, { useState, useEffect } from "react";
import axios from "axios";
import "./postsDisplay.css";

const PostsDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset current page when performing a new search
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortedPosts = [...posts]
    .filter((post) => {
      const { title, body } = post;
      const query = searchQuery.toLowerCase();
      return (
        title.toLowerCase().includes(query) ||
        body.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 3; // Max number of page numbers to display
    const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);

    let startPage;
    let endPage;

    if (totalPages <= maxPageNumbers) {
      // If total pages are less than or equal to Max page numbers, display all page numbers
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= halfMaxPageNumbers) {
      // If the current page is in the first half, display first maxPageNumbers page numbers
      startPage = 1;
      endPage = maxPageNumbers;
    } else if (currentPage + halfMaxPageNumbers >= totalPages) {
      // If the current page is in the last half, display last maxPageNumbers page numbers
      startPage = totalPages - maxPageNumbers + 1;
      endPage = totalPages;
    } else {
      // Otherwise, display the page numbers around the current page
      startPage = currentPage - halfMaxPageNumbers;
      endPage = currentPage + halfMaxPageNumbers;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="background">
      <div className="space-between">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search posts"
        />
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="">Sort By:</option>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      </div>
      <ul>
        {currentPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {currentPosts.length > 0 ? (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      ) : (
        <p className="space-between">No results found</p>
      )}
    </div>
  );
};

export default PostsDisplay;
