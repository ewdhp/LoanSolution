import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../../context/AuthContext';
import TwilioSMS from './TwilioSMS';
import Facebook from './Facebook';

const Login = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: SMS verification, 1: Facebook login
  const [errorMessage, setErrorMessage] = useState(''); // Store error messages
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { login, isAuthenticated } = useAuth();

  // Determine the heading text based on the route
  const headingText = location.pathname === '/signup' ? 'Registro' : 'Acceso';

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleVerifySuccess = (data) => {
    const { token, loginProviders } = data;
    console.log('received:', data);
    login(token); // Update the authentication state
    console.log('login provider: ', loginProviders[0]);
    if (loginProviders[0] === 'facebook') {
      console.log('Login successful');
      navigate('/dashboard');
      return;
    }
    console.log('Login successful');
    setCurrentStep(1);
  };

  const handleProviderSubmitSuccess = () => {
    navigate('/dashboard'); // Redirect to the dashboard after successful login
  };

  const handleProviderSubmitError = (error) => {
    setErrorMessage(`Error with Facebook login: ${error}`);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 'calc(100vh - 100px)', // Adjust the height to account for the navbar
      backgroundColor: '#f9f9f9',
    },
    title: {

      marginBottom: '2rem',
    },
    errorMessage: {
      color: 'red',
      marginTop: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Dynamically set the heading text */}
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

      {currentStep === 0 && (
        <TwilioSMS
          onVerifySuccess={handleVerifySuccess}
          onError={setErrorMessage}
        />
      )}

      {currentStep === 1 && (
        <Facebook
          onSubmit={handleProviderSubmitSuccess}
          onError={handleProviderSubmitError}
        />
      )}
    </div>
  );
};

export default Login;