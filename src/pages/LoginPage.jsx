import React from 'react';
import LogoLeftSection from '../components/LogoLeftSection';
import LoginSection from '../components/LoginSection';
import '../styles/LoginSection.css';

const LoginPage = () => {
  return (
    <div className="login">
      <LogoLeftSection />
      <LoginSection />
    </div>
  );
};

export default LoginPage;