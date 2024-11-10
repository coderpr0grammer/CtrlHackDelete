'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as ledgerIdlFactory, canisterId as ledgerCanisterId } from '@dfinity/ledger-icp';
import { Button } from '@/components/ui/button';

// Types
interface IICPContext {
  isConnected: boolean;
  principal: Principal | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserBalance: () => Promise<bigint | null>;
  getProjectFunding: (projectId: string) => Promise<bigint | null>;
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
  getUserBalance: async () => null,
  getProjectFunding: async () => null,
});

// Custom Hook
export const useICP = () => useContext(ICPContext);

// Provider Component
export const ICPProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);

  // Initialize Auth Client
  useEffect(() => {
    const init = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

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

    const newAgent = new HttpAgent({ identity });
    setAgent(newAgent);
  };

  const connect = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_II_URL || 'https://identity.ic0.app',
        onSuccess: () => handleAuthenticated(authClient),
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

  // Get User Balance
  const getUserBalance = async (): Promise<bigint | null> => {
    if (!agent || !principal) return null;

    try {
      const ledgerActor = Actor.createActor(ledgerIdlFactory, {
        agent,
        canisterId: ledgerCanisterId,
      });

      const balanceResult = await ledgerActor.account_balance({
        account: principal.toText(),
      });

      return balanceResult.e8s; // Returns balance in e8s (smallest unit of ICP)
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
      return null;
    }
  };

  // Get Project Funding from Canister
  const getProjectFunding = async (projectId: string): Promise<bigint | null> => {
    if (!agent) return null;

    try {
      const canisterActor = Actor.createActor(idlFactory, { agent, canisterId: 'YOUR_CANISTER_ID' });
      const project = await canisterActor.getProjectFunds(projectId);
      return project ? project.totalFunds : null;
    } catch (error) {
      console.error('Failed to fetch project funding:', error);
      return null;
    }
  };

  return (
    <ICPContext.Provider
      value={{
        isConnected,
        principal,
        connect,
        disconnect,
        getUserBalance,
        getProjectFunding,
      }}
    >
      {children}
    </ICPContext.Provider>
  );
};
