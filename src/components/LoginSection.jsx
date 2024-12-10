import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, apiUrl } from "../CommonImports";
import { setCurrentUser } from "../redux/slice";

const LoginSection = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('Please enter your username and password.');
      return;
    }

    const response = await fetch(apiUrl + "/auth/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"username": username, "password": password})
    });

    const data = await response.json();

    if (response.status == 200) {

      // Get the Genre
      const responseGenre = await fetch(apiUrl + "/user/genre?" + new URLSearchParams({
        userId: data.user.id
      }), 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "GET",
      });
      const genre = await responseGenre.json();
      
      // Compile the interests in an array
      const interests = [];
      genre.forEach((g) => {
        interests.push(g.music_genre)
      });

      dispatch(setCurrentUser({
        "userId": data.user.id,
        "username": data.user.username, 
        "interest": interests, 
        "fullname": data.user.fullname, 
        "status": data.user.status,
        "birthday": data.user.birthday,
        "email": data.user.email,
        "profilePic": data.user.profilePic + '?t=' + Date.now()  // to reload image
      }));
      navigate('/home');
    } else {
      alert('Login failed...');
    }
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="forgot-password">
          <span onClick={() => navigate('/resetpassword')}>
            Forget Password?
          </span>
        </div>
        <button type="submit">Login</button>
      </form>
      
      <p className="signup-link">
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')}>
          Create account
        </span>
      </p>
      
      <p className="divider">or</p>
      
      <div className="social-login">
        <button>Sign in with Google</button>
        <button>Sign in with Facebook</button>
      </div>
    </div>
  );
};

export default LoginSection;