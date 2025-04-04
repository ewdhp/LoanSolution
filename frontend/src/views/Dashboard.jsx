import React from 'react';
import { LoanProvider } from '../context/LoanContext';
import PhaseManager from '../components/PhaseManager';

const Dashboard = () => {
  console.log("🚀 Dashboard Mounted");

  const styles = {
 container: {
    display: 'block',
    justifyContent: 'center', // Centers child elements horizontally
    width: '100%',             // Ensures parent container takes the full width
    height: '100vh',           // Ensures parent container takes full viewport height
  },
    heading: {
      fontSize: '2em',

    },
  };

  return (
    <div style={styles.container}>
      <LoanProvider>
        <PhaseManager />
      </LoanProvider>
    </div>
  );
};

export default Dashboard;