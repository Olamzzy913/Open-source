import { createContext, useState } from "react";

export const LoadingContext = createContext({
  setLoadingMessage: () => "",
  loadingMessage: "",
});

export const LoadingProvider = ({ children }) => {
  const [loadingMessage, setLoadingMessage] = useState(null);
  const value = { loadingMessage, setLoadingMessage };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
