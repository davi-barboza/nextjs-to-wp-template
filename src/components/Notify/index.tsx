import React, { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';
import { IoCheckmark, IoClose, IoWarning } from 'react-icons/io5';
import { NotifySeverityEnum } from '@/domain/enums/notify-severity.enum';

const containerVariants = tv({
  base: 'relative flex w-full border-l-6 p-3 shadow-md md:p-3 dark:bg-[#2a2a34]',
  variants: {
    severity: {
      [NotifySeverityEnum.ERROR]: 'border-[#F87171] bg-[#fedcdc]',
      [NotifySeverityEnum.SUCCESS]: 'border-[#34D399] bg-[#c6fee9]',
      [NotifySeverityEnum.WARNING]: 'border-warning bg-[#ffe8c0]',
    },
  },
  defaultVariants: {
    severity: NotifySeverityEnum.WARNING,
  },
});

const boxIconVariants = tv({
  base: 'mr-3 flex h-7 w-7 items-center justify-center rounded-lg bg-opacity-30',
  variants: {
    severity: {
      [NotifySeverityEnum.ERROR]: 'bg-[#F87171]',
      [NotifySeverityEnum.SUCCESS]: 'bg-[#34D399]',
      [NotifySeverityEnum.WARNING]: 'bg-warning',
    },
  },
  defaultVariants: {
    severity: NotifySeverityEnum.WARNING,
  },
});

const titleVariants = tv({
  base: 'mb-1 text-md font-semibold',
  variants: {
    severity: {
      [NotifySeverityEnum.ERROR]: 'text-[#B45454]',
      [NotifySeverityEnum.SUCCESS]: 'dark:text-[#34D399]',
      [NotifySeverityEnum.WARNING]: 'text-[#9D5425]',
    },
  },
  defaultVariants: {
    severity: NotifySeverityEnum.WARNING,
  },
});

const messageVariants = tv({
  base: 'leading-relaxed text-sm',
  variants: {
    severity: {
      [NotifySeverityEnum.ERROR]: 'text-[#CD5D5D]',
      [NotifySeverityEnum.SUCCESS]: '',
      [NotifySeverityEnum.WARNING]: 'text-[#D0915C]',
    },
  },
  defaultVariants: {
    severity: NotifySeverityEnum.WARNING,
  },
});

const closeVariants = tv({
  base: 'rounded-full h-7 w-7 flex justify-center items-center absolute top-3 right-3 bg-opacity-50 cursor-pointer',
  variants: {
    severity: {
      [NotifySeverityEnum.ERROR]: 'bg-[#F87171]',
      [NotifySeverityEnum.SUCCESS]: 'bg-[#34D399]',
      [NotifySeverityEnum.WARNING]: 'bg-warning',
    },
  },
  defaultVariants: {
    severity: NotifySeverityEnum.WARNING,
  },
});

type NotifyProps = ComponentProps<'div'> & {
  title: string;
  messages: string[];
  severity: NotifySeverityEnum;
  onClose: () => void;
};

const Notify: React.FC<NotifyProps> = ({ title, messages, className, severity, onClose }) => {
  const severityIcons = {
    [NotifySeverityEnum.SUCCESS]: { color: 'white', Icon: IoCheckmark },
    [NotifySeverityEnum.WARNING]: { color: '#FBBF24', Icon: IoWarning },
    [NotifySeverityEnum.ERROR]: { color: 'white', Icon: IoClose },
  };

  const SeverityIcon = severityIcons[severity];

  return (
    <div className={containerVariants({ severity, className })}>
      <div className={boxIconVariants({ severity })}>
        <SeverityIcon.Icon size={19} color={SeverityIcon.color} />
      </div>
      <div className="w-full">
        <h5 className={titleVariants({ severity })}>{title ?? 'Atenção'}</h5>
        <div className={messageVariants({ severity })}>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={closeVariants({ severity })} onClick={onClose}>
        <IoClose className="text-white" size={19} />
      </div>
    </div>
  );
};

export default Notify;
