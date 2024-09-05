export interface WalletContextProps {
    isLoggedIn: boolean;
    login: (email?: string, number?: string) => Promise<void | any>;
    openWallet: () => void;
    logout: () => void;
    disconnectWallet: () => void;
    isEmailPopup: boolean;
    setIsEmailPopup: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }