import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl, useDispatch } from "../CommonImports";
import { setCurrentUser } from "../redux/slice";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    email: ''
  });
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backgroundImage = '/background.png';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 这里添加注册逻辑
    if (!formData.username || !formData.password || !formData.email) {
        setError('Please fill out all required fields.');
        return;
    }

    const response = await fetch(apiUrl + "/auth/register", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ "username": formData.username, "password": formData.password, "email": formData.email, "name": formData.fullName, "date_of_birth": formData.dateOfBirth})
    });

    const data = await response.json();

    if (response.status == 201) {
      alert('Sign up successful! Redirecting to login page...');

      dispatch(setCurrentUser({
        "userId": data.userId,
        "username": formData.username, 
        "interest": "", 
        "fullname": formData.fullName, 
        "status": "",
        "birthday": formData.dateOfBirth,
        "email": formData.email,
        "profilePic": ""  // to reload image
      }));

      navigate('/genre');
    } else {
      alert('Creating new account failed...');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* 左侧部分 */}
      <div
        style={{
          flex: 1,
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '20px',
          margin: 0,
          padding: 0,
          height: '100%',
        }}
      >
      </div>

      {/* 右侧部分 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '20px',
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Sign Up</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Please fill your information below</p>
        
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            gap: '15px',
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="UserName"
            value={formData.username}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="DD/MM/YYYY"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="abc@gmail.com"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Create
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#333' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login to your account
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;