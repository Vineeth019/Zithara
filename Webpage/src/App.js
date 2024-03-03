import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, sortBy]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery);
    fetchSearch();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    console.log(sortBy);
    fetchSearch();
  };

  const handleButton = async () => {
    console.log("Clicked");
    fetchSearch();
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?page=${currentPage}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search?prompt=${searchQuery}&sortBy=${sortBy}`);
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  return (
    <div className="App">
      <h1>Customers List</h1>
      <div>
        <label>Search: </label>
        <input type="text" value={searchQuery} onChange={handleSearchChange} />
        <label>Sort By: </label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
        <button onClick={handleButton}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>SNo</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.Sno}</td>
              <td>{user.CustomerName}</td>
              <td>{user.Age}</td>
              <td>{user.Phone}</td>
              <td>{user.Location}</td>
              <td>{user.Created_At.substring(0, 10)}</td>
              <td>{user.Created_At.substring(11, 19)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <button onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}>Previous</button>
      <span>{currentPage}</span>
      <button onClick={() => setCurrentPage(prevPage => prevPage + 1)}>Next</button>
    </div>
  );
}

export default App;