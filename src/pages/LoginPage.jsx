import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from "../CommonImports";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 用于页面跳转

  const backgroundImage = '/background.png';
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

    if (response.status == 200) {
      alert('Login successful! Redirecting to Homepage...');
      navigate('/home'); // 跳转到 HomePage
    } else {
      alert('Login failed...');
    }
    
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        width: '100vw',  // 添加这行
        margin: 0,       // 添加这行
        padding: 0,      // 添加这行
        overflow: 'hidden' // 添加这行，防止出现滚动条
      }}
    >
      {/* 左侧部分 */}
      <div
        style={{
          flex: 0.6,
          backgroundImage: 'url(/background.png)', // 替换为你的背景图片
          backgroundSize: 'cover',
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '20px',
          margin: 0,        // 添加这行
          padding: 0,       // 添加这行
          height: '100%',   // 添加这行
        }}
      >
      </div>

      {/* 右侧部分 */}
      <div
        style={{
          flex: 1.4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            gap: '15px',
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <div style={{ textAlign: 'right' }}>
            <span
              onClick={() => navigate('/resetpassword')} // 跳转到 SignUpPage
              style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forget Password?
            </span>
          </div>
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#333' }}>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')} // 跳转到 SignUpPage
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create account
          </span>
        </p>
        <p style={{ margin: '20px 0', fontSize: '12px', color: '#aaa' }}>or</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Sign in with Google
          </button>
          <button
            style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
