'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { removeNotification } from '@/store/notificationSlice';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Notify from '.';

const Notifications = () => {
  const { title, messages, severity } = useSelector((state: RootState) => state.notification);
  const pathName = usePathname();

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(removeNotification());
  }, [dispatch]);

  return (
    <AnimatePresence>
      {messages.length && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-[9999] mx-auto mb-3 w-11/12 ${pathName !== '/' && 'lg:left-72.5'} lg:w-1/2`}
          initial={{ y: 'calc(100% + 0.75rem)' }}
          animate={{ y: 0 }}
          exit={{ y: 'calc(100% + 0.75rem)' }}
          transition={{ duration: 0.3, ease: 'backInOut' }}
        >
          <Notify title={title} messages={messages} severity={severity} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notifications;
