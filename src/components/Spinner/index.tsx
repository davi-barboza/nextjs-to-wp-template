import React, { ComponentProps } from 'react';

type TLoaderProps = {} & ComponentProps<'div'>;

const Spinner: React.FC<TLoaderProps> = ({ className }) => {
  return (
    <div className={`h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent ${className}`}></div>
  );
};

export default Spinner;
