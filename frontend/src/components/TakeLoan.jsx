import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LoanContext } from '../context/LoanContext';

const TakeLoan = ({ loan = null, onFetchNextPhase }) => {
  const { amount, setAmount } = useContext(LoanContext);
  const [sliderValue, setSliderValue] = useState(amount || 0);

const styles = {
 container: {

    margin: '0px auto',         // Center the child container horizontally
    maxWidth: '350px',               // Child container takes full width of parent
    border: '1px solid rgb(142, 144, 146)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgb(255, 255, 255)',
    boxSizing: 'border-box',     // Ensures padding and borders are included in width calculations
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',        // Centers content inside the child container
      // Adds padding inside the container for better spacing
  },

  title: {
    fontSize: '1.3rem',
    margin: '30px', // Reduced margin between h2 and next element
    color: 'black',
  },

  sliderContainer: {
    margin: '5px 0',
    width: '100%',
    display: 'flex', // Use flexbox to manage the layout of the slider and other elements
    flexDirection: 'column', // Stack the slider and other elements vertically
    alignItems: 'center', // Ensure all items are centered horizontally
  },

  slider: {
    width: '87%',
    appearance: 'none',
    height: '15px',
    background: `linear-gradient(to right, #007bff 0%, #007bff 
    ${((sliderValue - 100) / 200) * 100}%, #ccc 
    ${((sliderValue - 100) / 200) * 100}%, #ccc 100%)`,
    borderRadius: '4px',
    outline: 'none',
    transition: 'background 0.3s',
  },

  amountText: {
    margin: '15px 0',
  },

  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  buttonHover: {
    backgroundColor: '#0056b3',
  },

  text: {
    margin: '10px 0',
  },

  inputContainer: {
    width: '100%',
    padding: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  },

  inputActive: {
    textAlign: 'center',
    width: '87%',
    maxWidth: '350px',
    padding: '10px',
    marginTop: '5px 0', // Remove margin to avoid unnecessary spacing
    border: '1px solid rgb(142, 144, 146)',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
};

  useEffect(() => {
    if (amount !== sliderValue) {
      setSliderValue(amount || 0);
    }
  }, [amount]);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    debounceSetAmount(value);
  };


  // Debounce function to delay updates to setAmount
  const debounceSetAmount = useCallback(
    debounce((value) => {
      setAmount(value);
    }, 200),
    []
  );

  return (
    <div style={styles.container}>
        <h2 style={styles.title}>Contrato por 7 días</h2>

      <div style={styles.sliderContainer}>     
        <input
          id="amount-slider"
          type="range"
          min="100"
          max="300"
          step="1"
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          style={styles.slider}
        />
        <div style={styles.text}>
          <p style={styles.amountText}>
            Interes diario $ {(sliderValue * 0.9 / 7).toFixed(2)}
          </p>
          <p style={styles.amountText}>
            Cantidad $ {sliderValue}
          </p>
        </div>

        <div style={styles.inputContainer}>
             <input
            type="text"
            placeholder="Referido"
            style={styles.inputActive} // Dynamically apply the input style
  
          />
        </div>
         
      
        <button
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
          onClick={() => onFetchNextPhase(sliderValue)}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default TakeLoan;
