// Optional publishable counter settings. Empty values disable all browser requests.
export const COUNTER = {
  url: import.meta.env.PUBLIC_COUNTER_RPC_URL || '',
  key: import.meta.env.PUBLIC_COUNTER_KEY || '',
  minShown: 5,
};
