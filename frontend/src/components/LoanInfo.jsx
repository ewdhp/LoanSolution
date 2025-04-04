import React from 'react';

const phases = [
  'Pre',
  'Inicial',
  'Creado',
  'Pendiente',
  'Aprovado',
  'Depositado',
  'Activo',
  'Pagado',
  'Due',
  'Cancelado',
  'Rechazado',
  'Unknown'
];

const container = {
  margin: '0px auto',              // Center the container horizontally
  maxWidth: '350px',
  border: '1px solid rgb(142, 144, 146)',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgb(255, 255, 255)',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px'                  // Added padding for spacing
};

const LoanInfo = ({ loan }) => {
  if (!loan) {
    console.error("🚨 LoanInfo received null or undefined 'data'!", loan);
    return (
      <div style={container}>
        <p>Espera...</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2>Detalles del crédito</h2>
      <p>Estado: {phases[loan?.status ?? 10]}</p>
      <p>Cantidad: ${(loan?.amount) ?? "N/A"} MXN</p>
      <p>{loan?.loanDescription ?? "N/A"}</p>
    </div>
  );
};

export default LoanInfo;
