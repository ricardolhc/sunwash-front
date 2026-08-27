let accessToken: string | null = null;
let sessionExpiredHandler: (() => void) | undefined;

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const clearAccessToken = (): void => {
  accessToken = null;
};

export const setSessionExpiredHandler = (handler: (() => void) | undefined): void => {
  sessionExpiredHandler = handler;
};

export const expireSession = (): void => {
  clearAccessToken();
  sessionExpiredHandler?.();
};
