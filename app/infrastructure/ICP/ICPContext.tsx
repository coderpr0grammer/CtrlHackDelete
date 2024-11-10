'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createAgent } from "@dfinity/utils";

import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";

interface IICPContext {
  isConnected: boolean;
  principal: Principal | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserBalance: () => Promise<bigint | null>;
  balance: bigint | null;
}

interface WalletProviderProps {
  children: ReactNode;
}

const ICPContext = createContext<IICPContext>({
  isConnected: false,
  principal: null,
  connect: async () => { },
  disconnect: async () => { },
  getUserBalance: async () => null,
  balance: null,
});

export const useICP = (): IICPContext => {
  const context = useContext(ICPContext);
  if (!context) throw new Error('useICP must be used within an ICPProvider');
  return context;
};

export const ICPProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
      client.isAuthenticated().then((auth) => {
        if (auth) handleAuthenticated(client);
      });
    });
  }, []);

  const handleAuthenticated = async (client: AuthClient) => {
    const identity = client.getIdentity();
    setPrincipal(identity.getPrincipal());
    setIsConnected(true);
  };

  useEffect(()=> {
    if (!principal || !authClient) return;
    getUserBalance().then((userBalance) => {
      setBalance(userBalance);
    });
  }, [principal, authClient])

  const connect = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.NEXT_PUBLIC_II_URL || 'https://identity.ic0.app',
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const disconnect = async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal(null);
    setIsConnected(false);
  };

  // Modify getUserBalance to use the createLedgerIDL function
  const HOST = "https://identity.ic0.app/";
  const MY_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const getUserBalance = async (
  ): Promise<bigint | null> => {
    if (!principal || !authClient) return null;

    try {
      const identity = authClient.getIdentity();
      const agent = await createAgent({
        identity,
        host: HOST,
      });

      const ledgerCanisterId = Principal.fromText(MY_LEDGER_CANISTER_ID);

      const ledgerCanister = LedgerCanister.create({
        agent,
        canisterId: ledgerCanisterId,
      });

      // Convert principal to account identifier
      const accountId = AccountIdentifier.fromPrincipal({
        principal: principal,
      });

      // Call with the correct argument format
      const balance = await ledgerCanister.accountBalance({
        accountIdentifier: accountId.toHex(),
      });

      return balance;
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
      throw error; // Re-throw to allow caller to handle specific errors
    }
  };

  const fundProject = async (projectAccountId: string, amount: bigint): Promise<void> => {
    if (!principal || !authClient || !balance || balance < amount) return;
  
    try {
      const identity = authClient.getIdentity();
      const agent = await createAgent({
        identity,
        host: HOST,
      });
  
      const ledgerCanisterId = Principal.fromText(MY_LEDGER_CANISTER_ID);
      const ledgerCanister = LedgerCanister.create({
        agent,
        canisterId: ledgerCanisterId,
      });
  
      const fromAccountId = AccountIdentifier.fromPrincipal({
        principal: principal,
      }).toHex();
  
      await ledgerCanister.send({
        from: fromAccountId,
        to: projectAccountId,
        amount: { e8s: amount }, // ICP uses e8s (10^8 e8s = 1 ICP)
      });
  
      // Update balance and tracking info after funding
      const updatedBalance = await getUserBalance();
      setBalance(updatedBalance);
  
      // Optionally log contribution off-chain or on-chain in your backend
      console.log(`Contributed ${amount} e8s to project with account ${projectAccountId}`);
    } catch (error) {
      console.error('Failed to fund project:', error);
      throw error;
    }
  };
  


  return (
    <ICPContext.Provider value={{ isConnected, principal, connect, disconnect, getUserBalance, balance }}>
      {children}
    </ICPContext.Provider>
  );
};
