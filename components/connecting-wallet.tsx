import { AuthClient } from "@dfinity/auth-client";
import { Actor, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

interface AccountInfo {
  principal: string;
  accountIdentifier: string;
  balance: bigint;
}

export class ICPWalletManager {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  async initialize(): Promise<void> {
    this.authClient = await AuthClient.create();
    
    if (await this.authClient.isAuthenticated()) {
      this.identity = await this.authClient.getIdentity();
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

  async getAccountInfo(canisterId: string): Promise<AccountInfo> {
    if (!this.identity) {
      throw new Error("Not authenticated");
    }

    const actor = Actor.createActor(idl, {
      agent: new HttpAgent({
        identity: this.identity,
        host: "https://ic0.app"
      }),
      canisterId
    });

    const principal = this.getPrincipal()!;
    const accountId = /* derive account ID from principal */;
    const balance = /* fetch balance */;

    return {
      principal: principal.toString(),
      accountIdentifier: accountId,
      balance: balance
    };
  }

  async listUserCanisters(): Promise<string[]> {
    if (!this.identity) {
      throw new Error("Not authenticated");
    }

    const managementCanister = Actor.createActor(/* management canister interface */, {
      agent: new HttpAgent({
        identity: this.identity,
        host: "https://ic0.app"
      }),
      canisterId: "aaaaa-aa"
    });

    return [];
  }
}

const walletManager = new ICPWalletManager();

async function initializeAndConnect() {
  await walletManager.initialize();
  
  if (!walletManager.isConnected()) {
    const connected = await walletManager.connect();
    if (connected) {
      console.log("Connected successfully!");
      const principal = walletManager.getPrincipal();
      console.log("Principal:", principal?.toString());
      
      const canisters = await walletManager.listUserCanisters();
      console.log("User's canisters:", canisters);
      
      const accountInfo = await walletManager.getAccountInfo("your-canister-id");
      console.log("Account info:", accountInfo);
    } else {
      console.error("Failed to connect");
    }
  }
}