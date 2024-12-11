import React from 'react';
import LogoLeftSection from '../components/LogoLeftSection';
import SignUpSection from '../components/SignUpSection';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
  return (
    <div className="signUp">
      <LogoLeftSection />
      <SignUpSection />
    </div>
  );
};

export default SignUpPage;
