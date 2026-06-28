import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const API_URL = 'http://localhost:5000/api/auth/forgotpassword'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(API_URL, { email });
      toast.success('Password reset email sent!');
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | My Notes App</title>
        <meta name="description" content="Reset your password." />
      </Helmet>
      
      <div className="container">
        <div className="glass-card">
          <h2 className="title">Forgot Password</h2>
          
          {emailSent ? (
            <div style={{ textAlign: 'center' }}>
              <p className="subtitle">We have sent a reset link to <strong>{email}</strong>. Please check your inbox.</p>
              <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="subtitle">Enter your email and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="link-text">
            Remember your password? <span>Sign in</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
