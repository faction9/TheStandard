import { useState } from 'react';
import './App.css';
import StandardLogo from './components/StandardLogo';

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    // Add your login logic here
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <StandardLogo />
          <a href="#" className="help-link">
            <span className="help-icon">?</span>
            Help
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="login-container">
          <div className="login-content">
            {/* Left Section - Full Account Access */}
            <div className="login-section login-section-left">
              <h1 className="login-title">Welcome</h1>

              <h2 className="section-title">Log in for full account access</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="login-button">
                  Log In
                </button>

                <div className="form-links">
                  <a href="#" className="form-link">Forgot user name?</a>
                  <a href="#" className="form-link">Forgot password?</a>
                </div>
              </form>

              <div className="divider">
                <span className="divider-text">or</span>
              </div>

              <p className="create-account-text">
                New here? <a href="#" className="form-link">Create an account</a> to connect to services.
              </p>
            </div>

            {/* Right Section - Dental & Vision */}
            <div className="login-section login-section-right">
              <h2 className="section-title">Log in for Dental & Vision (ONLY)</h2>

              <div className="link-group">
                <h3 className="link-group-title">Members</h3>
                <ul className="link-list">
                  <li>
                    <a href="#">If your employer is based outside of New York</a>
                  </li>
                  <li>
                    <a href="#">If your employer is based in New York</a>
                  </li>
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-group-title">Employers</h3>
                <ul className="link-list">
                  <li>
                    <a href="#">If based outside of New York</a>
                  </li>
                  <li>
                    <a href="#">If based in New York</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            The Standard is a marketing name for StanCorp Financial Group, Inc. (Portland, Oregon) licensed in all states except New York, and The Standard Life Insurance Company of New York (White Plains, New York) licensed only in New York. Products are underwritten and issued by state and also vary. For more information, see the applicable insurance contract.
          </p>
          <p className="footer-text">
            © {new Date().getFullYear()} StanCorp Financial Group, Inc.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Data & Identity Protection</a>
            <a href="#" className="footer-link">Privacy & Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
