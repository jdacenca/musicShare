import { useSelector, apiUrl, useNavigate } from "../CommonImports";
import React, { useState } from 'react';

import '../styles/Genre.css';
import pop from '../assets/images/pop.png';
import hiphop from '../assets/images/hiphop.png';
import instrumental from '../assets/images/instrumental.png';
import jazz from '../assets/images/jazz.png';

import country from '../assets/images/country.png';
import funk from '../assets/images/funk.png';
import indie from '../assets/images/indie.png'
import classical from '../assets/images/classical.png';

import alternative from '../assets/images/alternative.png';
import blues from '../assets/images/blues.png';
import rock from '../assets/images/rock.png';
import worldmusic from '../assets/images/worldmusic.png';

import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


const Genre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]); // State to track selected genres

  const currentUser = useSelector((state) => state.beatSnapApp.currentUser); // Get the current user from the Redux store

  const navigate = useNavigate(); // Navigation hook to redirect users

  // List of available music genres with their images
  const genres = [
    { name: 'Pop', image: pop },
    { name: 'Hip-Hop', image: hiphop },
    { name: 'Instrumental', image: instrumental },
    { name: 'Jazz', image: jazz },
    { name: 'Country', image: country },
    { name: 'Funk', image: funk },
    { name: 'Indie', image: indie },
    { name: 'Classical', image: classical },
    { name: 'Alternative', image: alternative },
    { name: 'Blues', image: blues },
    { name: 'Rock', image: rock },
    { name: 'World-Music', image: worldmusic }
  ];

  // Function to toggle genre selection
  const toggleGenreSelection = (genreName) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreName)
        ? prevSelected.filter((genre) => genre !== genreName) // Remove genre if already selected
        : [...prevSelected, genreName] // Add genre if not already selected
    );
  };

  // Function to skip genre selection
  const handleSkip = async () => {
    navigate('/login');
  };

  // Function to save selected genres
  const handleGenreSave = async () => {
    console.log(selectedGenres);

    if (selectedGenres.length === 0) { 
      toast('Please select a genre!');
      return;
    }

    // Send selected genres to the server
    const response = await fetch(apiUrl + "/user/genre", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ userId: currentUser.userId, genre: selectedGenres })
    });
    const data = await response.json();

    // Handle server response
    if (response.status === 200) { 
      toast('Saved genre.');
      navigate('/login');
    } else {
      toast('Encountered issue saving the genre');
    }
  };

  return (
    <div className="genre-container">
      <div className="left-section">
        <div className="svg"></div>
        <div className="logo">
          <div className="description">
            <h4>What type of music do you enjoy?</h4>
            <p>Choose 3 or more cards to personalize your music experience</p>
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="genre-options">
          <div className="genre-grid">
            {genres.map((genre) => (
              <div
                key={genre.name}
                className={`genre-card ${selectedGenres.includes(genre.name) ? 'selected' : ''}`}
                onClick={() => toggleGenreSelection(genre.name)}
              >
                <img
                  src={genre.image}
                  alt={genre.name}
                  className={selectedGenres.includes(genre.name) ? 'dimmed' : ''}
                />
                <h3>{genre.name}</h3>
                {selectedGenres.includes(genre.name) && (
                  <div className="tick-mark">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="genre-actions">
          <button className="def-button" onClick={handleGenreSave}>Save</button>
        </div>
        <a href="#" className="def-skip" onClick={handleSkip}>Skip this step</a>
      </div>
    </div>
  );
};

export default Genre;
