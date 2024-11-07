import React from "react";
import Navbar from "./components/Navbar";
import MusicFeed from "./components/MusicFeed";
import Header from "./components/Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <div className="app container">
      <div className="row">
        <Header/>
        {/* <div className="col-3"> */}
          <Navbar />
        {/* </div>
        <div className="col-9"> */}
          <MusicFeed />
        {/* </div> */}
      </div>
    </div>
  );
}

export default App;
