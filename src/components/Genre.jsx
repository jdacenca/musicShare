import { useSelector, useDispatch, apiUrl } from "../CommonImports";
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


const Genre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const dispatch = useDispatch();

  const genres = [
    { name: 'Pop', image: pop },
    { name: 'Hip-Hop', image: hiphop },
    { name: 'Instrumental', image: instrumental },
    { name: 'Jazz', image: jazz },
    { name: 'Country', image: country},
    { name: 'Funk', image: funk },
    { name: 'Indie', image: indie},
    { name: 'Classical', image: classical },
    { name: 'Alternative', image: alternative },
    { name: 'Blues', image: blues },
    { name: 'Rock', image: rock },
    { name: 'World-Music', image: worldmusic  }
  ];

  const toggleGenreSelection = (genreName) => {
    setSelectedGenres(prevSelected => 
      prevSelected.includes(genreName)
        ? prevSelected.filter(genre => genre !== genreName)
        : [...prevSelected, genreName]
    );
  };

  const handleGenreSave = async () => {
    console.log(selectedGenres)

    if (selectedGenres.lenght === 0) {
      alert('Please select a genre!.');
      return;
    }

    const response = await fetch(apiUrl + "/user/genre", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"userId": currentUser.userId, "genre": selectedGenres})
    });
    const data = await response.json();

    if (response.status == 200) {
      alert('Saved!');
      navigate('/home');
    } else {
      alert('Login failed...');
    }
  };

  return (
    <div className="genre-container">
      <div className="left-section">
        <div className="svg"></div>
        <div className="logo">
        <div className="description">
          <h4>What type of music do you enjoy?</h4>
          <p>Choose 3 or more card to personalize your music experience</p>
        </div>
        </div>
      </div>
      <div>
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
          <a href="#" className="def-skip">Skip this step</a>
        </div>
    </div>
  );
};

export default Genre;
