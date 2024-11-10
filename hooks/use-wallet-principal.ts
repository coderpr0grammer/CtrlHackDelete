import { useICP } from "@/app/infrastructure/ICP/ICPContext"

export function useWalletPrincipal() {
  const { principal } = useICP()
  return principal ? principal.toString() : null
} 