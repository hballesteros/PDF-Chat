import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.CHAT_MODE);
export const appStatusInfo = writable({
  id: '0de04c42def5c2c90a97ff7c3e7d1f5c',
  url: 'https://res.cloudinary.com/duxgyi7d5/image/upload/v1707353808/pdf/qjzeuhojttweubyxudca.pdf',
  pages: 4,
});

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setAppStatusChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};
