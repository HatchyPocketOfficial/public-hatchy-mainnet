import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  withSigner=false
): T | null {

  const { provider: library, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) {
      return null;
    }

    try {
      return new Contract(address, ABI, withSigner ? library.getSigner(account).connectUnchecked() : library);
    } catch (error) {
      console.error("Failed To Get Contract", error);
      return null;
    }

  }, [address, ABI, withSigner, library, account]) as T;
}