import React from 'react';

type RupiahFormatterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimal?: number;
  className?: string;
  style?: React.CSSProperties;
};

const RupiahFormatter: React.FC<RupiahFormatterProps> = ({
  value,
  prefix = 'IDR',
  suffix = '',
  decimal = 0,
  className = '',
  style
}) => {
  const formatNumber = (num: number | string): string => {
    const number = typeof num === 'number' ? num : parseFloat(num);
    return number.toFixed(decimal)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (value === 0) {
    return <span className={className} style={style}>Gratis</span>;
  }

  return (
    <span className={className} style={style}>
      {prefix && <span>{prefix} </span>}
      {formatNumber(value)}
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

export default RupiahFormatter;

