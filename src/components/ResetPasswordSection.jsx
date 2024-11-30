import React from "react";
import "../styles/ResetPassword.css";

const ResetPasswordSection = () => {
  return (
    
    <div className="right-section">
      <h2>Reset Password</h2>
      <p>
        Trouble with logging in? Enter your email address and we’ll
        send you a link to get back into your account.
      </p>
      <form>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="enter your email"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Send Login Link
        </button>
      </form>
      <div className="additional-options">
        <p>
          Already have an account? <a href="#">Login to your account</a>
        </p>
        <p>or</p>
        <div className="social-login">
          <button className="btn-google">Sign in with Google</button>
          <button className="btn-facebook">Sign in with Facebook</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSection;