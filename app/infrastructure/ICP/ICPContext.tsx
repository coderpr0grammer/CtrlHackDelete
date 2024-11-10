'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createAgent } from "@dfinity/utils";
import { IDL } from '@dfinity/candid';

import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { get } from 'http';
import { Project } from '@/types/database';
import { useLocalStorage } from '@/hooks/useLocalstorage';

// Ledger Canister ID for mainnet
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

interface Token {
  e8s: bigint;
}

interface IICPContext {
  isConnected: boolean;
  principal: Principal | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserBalance: () => Promise<bigint | null>;
  balance: bigint | null;
  toggleFundModal: () => void;
  fundModalOpen: boolean;
  setFundModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProject: Project | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  userBalance: number;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
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
  toggleFundModal: () => { },
  fundModalOpen: false,
  setFundModalOpen: () => { },
  selectedProject: null,
  setSelectedProject: () => { },
  userBalance: 0,
  setUserBalance: () => { },
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
  const [fundModalOpen, setFundModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [userBalance, setUserBalance] = useLocalStorage<number>('userBalance', 1000000);

  const toggleFundModal = () => {
    setFundModalOpen(!fundModalOpen);
  }

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

  useEffect(() => {
    getUserBalance().then((userBalance) => {
      setBalance(userBalance);
    });
  }, [principal, authClient])

  const connect = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: 'https://identity.internetcomputer.org',  // testnet II URL
      onSuccess: () => handleAuthenticated(authClient),
      // Optional: Add derivationOrigin for local development
      derivationOrigin: 'http://localhost:3000'
    });
};

  const disconnect = async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal(null);
    setIsConnected(false);
  };

  // Define the Ledger Canister IDL Factory
  const createLedgerIDL = ({ IDL }: any) => {
    const Token = IDL.Record({ 'e8s': IDL.Nat64 });
    const Account = IDL.Record({
      'owner': IDL.Principal,
      'subaccount': IDL.Opt(IDL.Vec(IDL.Nat8))
    });
    return IDL.Service({
      'account_balance': IDL.Func([Account], [Token], ['query']),
    });
  };

  // Modify getUserBalance to use the createLedgerIDL function
  const HOST = "https://identity.ic0.app/";
  const MY_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

  const getUserBalance = async (): Promise<bigint | null> => {
    if (!principal || !authClient) return null;

    try {
      const identity = authClient.getIdentity();

      const agent = await createAgent({
        identity,
        host: "https://ic0.app",
        verifyQuerySignatures: false
      });

      const ledgerCanisterId = Principal.fromText(LEDGER_CANISTER_ID);

      const ledgerCanister = LedgerCanister.create({
        agent,
        canisterId: ledgerCanisterId,
      });

      // Convert principal to account identifier
      const accountId = AccountIdentifier.fromPrincipal({
        principal: principal,
      });

      // Use accountBalance instead of balance
      const balance = await ledgerCanister.accountBalance({
        accountIdentifier: accountId,
      });

      return balance;
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
      return null;
    }
  };

  const handleTransfer = async (amount: number, recipientAddress: string) => {


    try {
      if (!principal || !isConnected) {
        throw new Error('Please connect your wallet first');
      }

      const numericAmount = amount
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Convert ICP to e8s (1 ICP = 100000000 e8s)
      const e8sAmount = BigInt(Math.floor(numericAmount * 100000000));

      if (balance && e8sAmount > balance) {
        throw new Error('Insufficient funds');
      }

      const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

      // Create agent and ledger canister instance

      const identity = authClient?.getIdentity();
      if (!identity) throw new Error('Failed to get identity');

      const agent = await createAgent({
        identity,
        host: HOST,
      });

      const ledgerCanister = LedgerCanister.create({
        agent,
        canisterId: Principal.fromText(LEDGER_CANISTER_ID),
      });

      // Convert recipient address to AccountIdentifier
      let recipientAccountId;
      try {
        // First try to parse as a Principal
        const recipientPrincipal = Principal.fromText(recipientAddress);
        recipientAccountId = AccountIdentifier.fromPrincipal({
          principal: recipientPrincipal,
        });
      } catch {
        // If that fails, try to parse as an AccountIdentifier directly
        recipientAccountId = AccountIdentifier.fromHex(recipientAddress);
      }

      // Send the transfer
      const result = await ledgerCanister.transfer({
        to: recipientAccountId,
        amount: e8sAmount,
      });

      console.log(`Transfer successful! Block height: ${result}`);

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
  };



  return (
    <ICPContext.Provider value={{
      isConnected,
      principal,
      connect,
      disconnect,
      getUserBalance,
      balance,
      toggleFundModal,
      fundModalOpen,
      setFundModalOpen,
      selectedProject,
      setSelectedProject,
      userBalance,
      setUserBalance, 
    }}>
      {children}
    </ICPContext.Provider>
  );
};
