import React from 'react';

function Navbar() {
  return (
    <div>
      <div className="nav-icons">
        <i className="fas fa-home"></i>
        <i className="fas fa-music"></i>
        <i className="fas fa-user"></i>
            <ul>
                <li>Home</li>
                <li>Search</li>
                <li>Create</li>
                <li>History</li>
                <li>Friends</li>
                <li>Playlists</li>
            </ul>
      </div>

    </div>
  );
}

export default Navbar;
