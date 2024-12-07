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

  const genres = [
    { name: 'POP', image: pop },
    { name: 'HIP POP', image: hiphop },
    { name: 'INSTRUMENTAL', image: instrumental },
    { name: 'JAZZ', image: jazz },
    { name: 'COUNTRY', image: country},
    { name: 'FUNK', image: funk },
    { name: 'INDIE', image: indie},
    { name: 'CLASSICAL', image: classical },
    { name: 'ALTERNATIVE', image: alternative },
    { name: 'BLUES', image: blues },
    { name: 'ROCK', image: rock },
    { name: 'WORLD MUSIC', image: worldmusic  }
  ];

  const toggleGenreSelection = (genreName) => {
    setSelectedGenres(prevSelected => 
      prevSelected.includes(genreName)
        ? prevSelected.filter(genre => genre !== genreName)
        : [...prevSelected, genreName]
    );
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
          <button className="genre-button">Create</button>
          <button className="genre-button">Cancel</button>
          <a href="#" className="genre-skip">Skip this step</a>
        </div>
      </div>
    </div>
  );
};

export default Genre;
