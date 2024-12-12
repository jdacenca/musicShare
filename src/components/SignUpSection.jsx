import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, apiUrl  } from '../CommonImports'; 
import { setCurrentUser } from '../redux/slice'; 

const SignUpSection = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    email: ''
  });

  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username || !formData.password || !formData.email) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch(apiUrl + "/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: formData.fullName,
          date_of_birth: formData.dateOfBirth
        })
      });

      if (response.status === 201) {
        const data = await response.json();

        // Dispatch to Redux store
        dispatch(setCurrentUser({
          userId: data.userId,
          username: formData.username, 
          interest: data.interest || "", 
          fullname: formData.fullName, 
          status: data.status || "",
          birthday: formData.dateOfBirth,
          email: formData.email,
          profilePic: data.profilePicn +'?t=' + Date.now()  
        }));

        alert('Sign up successful! Redirecting to login page...');
        navigate('/home');
      } else {
        alert('Creating new account failed...'+ data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Failed to create account. Please try again later.");
    }
  };
  
  return (
    <div className="signup-section">
      <h2 className="title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="UserName" value={formData.username} onChange={handleChange} className="input-field" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-field" />
        <input type="text" name="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange} className="input-field" />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
        <input type="email" name="email" placeholder="abc@gmail.com" value={formData.email} onChange={handleChange} className="input-field" />
        <button type="submit" className="submit-button">Create</button>
      </form>
      <p className="back-to-login">Already have an account? <span onClick={() => navigate('/login')} className="link">Login to your account</span></p>
    </div>
  );
};

export default SignUpSection;
