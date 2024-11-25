import React from "react";
import LogoLeftSection from "../components/LogoLeftSection";
import ResetPasswordSection from "../components/ResetPasswordSection";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  return (
    <div className="reset">
      <LogoLeftSection />
      <ResetPasswordSection />
    </div>
  );
};

export default ResetPassword;