import React, { useState } from 'react';
import axios from 'axios';

const TwilioSMS = ({ onVerifySuccess, onError }) => {
  const [phone, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false); // State to disable the resend button
  const [resendTimer, setResendTimer] = useState(0); // Timer for resend cooldown

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSmsCodeChange = (e) => {
    setSmsCode(e.target.value);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{10,15}$/; // E.164 format
    return phoneRegex.test(phone);
  };

  const validateSmsCode = (code) => {
    const codeRegex = /^\d{6}$/; // Exactly 6 digits
    return codeRegex.test(code);
  };

  const handleSendSms = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validatePhoneNumber(`+52${phone}`)) {
      setErrorMessage('El número de teléfono no es válido.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:5001/api/testauth/send', {
        Phone: `+52${phone}`,
      });
      if (response.status === 200) {
        setCurrentStep(1);
        startResendCooldown(); // Start the cooldown timer
      } else {
        onError('No se pudo enviar el SMS. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      onError('No se pudo enviar el SMS. Inténtalo de nuevo.');
    }
  };

  const handleVerifySms = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateSmsCode(smsCode)) {
      setErrorMessage('El código SMS debe tener exactamente 6 dígitos.');
      return;
    }

    try {
      let token = localStorage.getItem('token');
      if (token) {
        token = `Bearer ${token}`;
      } else {
        console.warn('Token is missing from localStorage');
      }

      const response = await axios.post(
        'https://localhost:5001/api/testauth/verify',
        {
          Phone: `+52${phone}`,
          Code: smsCode,
        },
        {
          headers: {
            Authorization: token || '',
          }
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage:', token);
        }

        onVerifySuccess(response.data);
      } else {
        onError('El código SMS no es válido. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error verifying SMS:', error);
      onError('El código SMS no es válido. Inténtalo de nuevo.');
    }
  };

  const handleResendSms = async () => {
    setErrorMessage('');

    if (!validatePhoneNumber(`+52${phone}`)) {
      setErrorMessage('El número de teléfono no es válido.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:5001/api/testauth/send', {
        Phone: `+52${phone}`,
      });
      if (response.status === 200) {
        startResendCooldown(); // Restart the cooldown timer
      } else {
        onError('No se pudo reenviar el SMS. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error resending SMS:', error);
      onError('No se pudo reenviar el SMS. Inténtalo de nuevo.');
    }
  };

  const startResendCooldown = () => {
    setIsResendDisabled(true);
    let timer = 30; // Cooldown time in seconds
    setResendTimer(timer);

    const interval = setInterval(() => {
      timer -= 1;
      setResendTimer(timer);

      if (timer <= 0) {
        clearInterval(interval);
        setIsResendDisabled(false);
      }
    }, 1000);
  };

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '1em',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '90%', // Flexible width for smaller screens
    maxWidth: '350px', // Max width for larger screens
    minWidth: '250px', // Min width to prevent being too small
    boxSizing: 'border-box',
    margin: '0px auto', // Center the form on the screen
  },
  input: {
    display: 'flex',
    textAlign: 'center',
    width: '100%', // Full width input
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', // Full width button
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  resendButton: {
    marginTop: '10px',
    width: '100%', // Full width resend button
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: isResendDisabled ? '#ccc' : '#007bff',
    color: '#fff',
    fontSize: '1em',
    cursor: isResendDisabled ? 'not-allowed' : 'pointer',
    boxSizing: 'border-box',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  heading: {
    margin: '0 0 20px 0',
    fontSize: '1rem',
  },
};



  return (
    <>
      {currentStep === 0 && (
        <form style={styles.form} onSubmit={handleSendSms}>
          <h3 style={styles.heading}>Teléfono Movil</h3>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          <input
            type="text"
            placeholder="10 digitos"
            value={phone}
            onChange={handlePhoneNumberChange}
            style={styles.input}
            aria-label="Teléfono"
          />
          <button type="submit" style={styles.button}>Enviar SMS</button>
        </form>
      )}
      {currentStep === 1 && (
        <form style={styles.form} onSubmit={handleVerifySms}>
          <h3 style={styles.heading}>Código enviado </h3>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          <input
            type="text"
            placeholder="6 dígitos"
            value={smsCode}
            onChange={handleSmsCodeChange}
            style={styles.input}
            aria-label="Código SMS"
          />
          <button type="submit" style={styles.button}>Verificar SMS</button>
          <button
            type="button"
            style={styles.resendButton}
            onClick={handleResendSms}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Reenviar en ${resendTimer}s` : 'Reenviar Código'}
          </button>
        </form>
      )}
    </>
  );
};

export default TwilioSMS;