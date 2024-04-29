import React from 'react';

const ErrorState: React.FC<{ text: string }> = ({ text }) => (
  <div>
    <h1>Error</h1>
    <p>{text}</p>
  </div>
);

export default ErrorState;