import {
  React,
  useState,
  useNavigate,
  apiUrl,
} from "../CommonImports";
import "../styles/ResetPassword.css";

const ResetPasswordSection = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email.');
      return;
    }

    const response = await fetch(apiUrl + "/user/resetpassword", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"email": email})
    });
    //const data = await response.json();

    console.log(response.status)
    if (response.status == 200) {
      alert('Email Sent!');
    } else {
      alert('Email failed!...');
    }
    
  };
  return (
    
    <div className="right-section">
      <h2>Reset Password</h2>
      <p>
        Trouble with logging in? Enter your email address and we’ll
        send you a link to get back into your account.
      </p>
      <form
        onSubmit={handleResetPassword}
      >
        
        <div className="input-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Send Login Link
        </button>
      </form>
      <div className="additional-options">
        <p>
        Already have an account?
        <span onClick={() => navigate('/login')} >
          <a href="#">Login to your account</a>
        </span> 
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