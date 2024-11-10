import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";

// Ledger canister interface
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

interface Token {
  e8s: bigint;  // ICP tokens are denominated in e8s (1 ICP = 100000000 e8s)
}

interface LedgerCanister {
  account_balance: (args: { account: Array<number> }) => Promise<Token>;
}

const ledgerIDL = ({ IDL }: any) => {
  return IDL.Service({
    account_balance: IDL.Func(
      [IDL.Record({ account: IDL.Vec(IDL.Nat8) })],
      [IDL.Record({ e8s: IDL.Nat64 })],
      ['query']
    ),
  });
};

interface AccountInfo {
  principal: string;
  accountIdentifier: string;
  balance: bigint;
}

export class ICPWalletManager {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private agent: HttpAgent | null = null;

  async initialize(): Promise<void> {
    this.authClient = await AuthClient.create();
    
    if (await this.authClient.isAuthenticated()) {
      this.identity = await this.authClient.getIdentity();
      this.agent = new HttpAgent({
        identity: this.identity,
        host: "https://ic0.app"
      });
    }
  }

  async connect(): Promise<boolean> {
    if (!this.authClient) {
      throw new Error("AuthClient not initialized");
    }

    return new Promise((resolve) => {
      this.authClient?.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: async () => {
          this.identity = await this.authClient!.getIdentity();
          resolve(true);
        },
        onError: () => {
          resolve(false);
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    if (!this.authClient) {
      throw new Error("AuthClient not initialized");
    }

    await this.authClient.logout();
    this.identity = null;
  }

  isConnected(): boolean {
    return !!this.identity;
  }

  getPrincipal(): Principal | null {
    if (!this.identity) return null;
    return this.identity.getPrincipal();
  }

  async getBalance(): Promise<number> {
    if (!this.identity || !this.agent) {
      throw new Error("Not authenticated");
    }

    try {
      // Create account identifier from principal
      const principal = this.identity.getPrincipal();
      const accountIdentifier = AccountIdentifier.fromPrincipal({
        principal: principal,
      });

      // Create ledger actor
      const ledgerActor = Actor.createActor<LedgerCanister>(ledgerIDL, {
        agent: this.agent,
        canisterId: LEDGER_CANISTER_ID,
      });

      // Get balance
      const balance = await ledgerActor.account_balance({
        account: Array.from(accountIdentifier.toUint8Array()),
      });

      // Convert e8s to ICP (1 ICP = 100000000 e8s)
      return Number(balance.e8s) / 100000000;
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }

  async getAccountInfo(): Promise<AccountInfo> {
    if (!this.identity) {
      throw new Error("Not authenticated");
    }

    const principal = this.getPrincipal()!;
    const accountIdentifier = AccountIdentifier.fromPrincipal({
      principal: principal,
    });
    const balance = await this.getBalance();

    return {
      principal: principal.toString(),
      accountIdentifier: accountIdentifier.toHex(),
      balance: BigInt(Math.floor(balance * 100000000)) // Convert back to e8s
    };
  }

 
}

const walletManager = new ICPWalletManager();

async function checkBalance() {
  await walletManager.initialize();
  
  if (walletManager.isConnected()) {
    try {
      const accountInfo = await walletManager.getAccountInfo();
      console.log("Account Info:", {
        principal: accountInfo.principal,
        accountId: accountInfo.accountIdentifier,
        balance: `${Number(accountInfo.balance) / 100000000} ICP`
      });
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  } else {
    console.log("Please connect your wallet first");
  }
}
