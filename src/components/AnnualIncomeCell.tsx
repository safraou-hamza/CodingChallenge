// src/components/AnnualIncomeCell.tsx
import React from 'react';

const AnnualIncomeCell: React.FC<{ value: number }> = ({ value }) => {
  return (
    <>
      {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value)}
    </>
  );
};

export default AnnualIncomeCell;
