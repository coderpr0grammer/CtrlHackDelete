// First, install required dependencies:
// npm install @dfinity/agent @dfinity/auth-client @dfinity/identity @dfinity/principal

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// Types
interface IICPContext {
  isConnected: boolean;
  principal: Principal | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

interface WalletProviderProps {
  children: ReactNode;
}

// Create Context
const ICPContext = createContext<IICPContext>({
  isConnected: false,
  principal: null,
  connect: async () => {},
  disconnect: async () => {},
});

// Custom Hook
export const useICP = () => useContext(ICPContext);

// Provider Component
export const ICPProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  // Initialize Auth Client
  useEffect(() => {
    const init = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      // Check if user is already authenticated
      if (await client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    };

    init();
  }, []);

  const handleAuthenticated = async (client: AuthClient) => {
    const identity = client.getIdentity();
    const userPrincipal = identity.getPrincipal();
    setPrincipal(userPrincipal);
    setIsConnected(true);
  };

  const connect = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_II_URL || 'https://identity.ic0.app',
        onSuccess: () => handleAuthenticated(authClient),
        windowOpenerFeatures: 
          `left=${window.screen.width / 2 - 525}, ` +
          `top=${window.screen.height / 2 - 375}, ` +
          `toolbar=0,location=0,menubar=0,width=1050,height=750`,
      });
    } catch (e) {
      console.error('Failed to connect wallet:', e);
    }
  };

  const disconnect = async () => {
    if (!authClient) return;

    await authClient.logout();
    setPrincipal(null);
    setIsConnected(false);
  };

  return (
    <ICPContext.Provider value={{ isConnected, principal, connect, disconnect }}>
      {children}
    </ICPContext.Provider>
  );
};

// Usage Example Component
export const ConnectWalletButton = () => {
  const { isConnected, connect, disconnect, principal } = useICP();

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={connect}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect ICP Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {principal?.toString()}</p>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};