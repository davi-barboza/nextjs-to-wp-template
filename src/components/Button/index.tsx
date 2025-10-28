import React, { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { IconType } from 'react-icons';
import Spinner from '../Spinner';

const variants = tv({
  base: 'flex justify-center items-center w-full cursor-pointer rounded-lg border border-primary bg-primary text-white transition hover:bg-opacity-90',
  variants: {
    dense: {
      true: 'py-2.5 px-4',
      false: 'p-4',
    },
    icon: {
      true: 'gap-2 justify-between',
      false: '',
    },
  },
  defaultVariants: {
    dense: false,
    icon: false,
  },
});

type ButtonProps = ComponentProps<'button'> &
  Omit<VariantProps<typeof variants>, 'icon'> & {
    loading?: boolean;
    dense?: boolean;
    icon?: IconType;
  };

const Button: React.FC<ButtonProps> = ({ icon: Icon, dense, loading, onClick, children, className }) => {
  return (
    <button onClick={onClick} className={variants({ icon: !!Icon, dense, className })}>
      {!loading && Icon && <Icon />}

      {loading ? (
        <div className="flex justify-center">
          <Spinner className="h-6 w-6 border-white" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
