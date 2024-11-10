import { useICP } from "@/app/infrastructure/ICP/ICPContext";
import { Button } from "./ui/button";

// Usage Example Component
export const ConnectWalletButton = () => {
    const { isConnected, connect, disconnect, principal } = useICP();
  
    return (
      <Button
        onClick={() => {
          if (isConnected) {
            disconnect()
          } else {
            console.log('disconnect')
            connect()
          }
        }}
        className=""
      >
        {principal ? `Wallet: ${principal.toString().substring(0, 5)}...${principal.toString().substring(principal.toString().length - 5)}` : 'Connect Wallet'}
      </Button>
  
    );
  };