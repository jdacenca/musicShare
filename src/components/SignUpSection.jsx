import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, apiUrl  } from '../CommonImports'; 

const SignUpSection = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    email: ''
  });

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
    // 添加注册逻辑
    const response = await fetch(apiUrl + "/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
  
    const data = await response.json();  // 解析JSON响应
  
    if (response.status === 201) {  // 假设201是成功的状态码
      dispatch(setCurrentUser({   // 假设你想在注册后直接登录用户
        "userId": data.user.id,
        "username": data.user.username, 
        "interest": data.user.interest, 
        "fullname": data.user.fullname, 
        "status": data.user.status,
        "birthday": data.user.birthday,
        "profilePic": data.user.profilePic + '?t=' + Date.now()  // 为图片重载添加时间戳
      }));
      navigate('/home');  // 导航到主页
    } else {
      alert('Failed to create account: ' + data.message);  // 显示错误消息
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
