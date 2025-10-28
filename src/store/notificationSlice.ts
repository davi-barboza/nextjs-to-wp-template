import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotifySeverityEnum } from '@/domain/enums/notify-severity.enum';

export interface NotificationState {
  title: string;
  messages: string[];
  severity: NotifySeverityEnum;
}

const initialState: NotificationState = {
  title: '',
  messages: [],
  severity: NotifySeverityEnum.WARNING,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationState>) => {
      state.title = action.payload.title;
      state.messages = action.payload.messages;
      state.severity = action.payload.severity;
    },
    removeNotification: (state) => {
      state.title = '';
      state.messages = [];
      state.severity = NotifySeverityEnum.WARNING;
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
