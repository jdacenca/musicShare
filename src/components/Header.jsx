import React from "react";

function Header() {
  return (
    <div>
      <header className="header d-flex flex-row">
        <div className="col-3 p-4 ">
          <h2>Music Share</h2>
        </div>
        <div className="col-9 p-4 align-self-center">
          <input type="text" className="w-100" placeholder="Search music..." />
        </div>
      </header>
    </div>
  );
}

export default Header;
