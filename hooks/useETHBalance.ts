import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { parseBalance } from "../utils/numberFormatterHelper";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getETHBalance(library: any) {
  return async (address: string, _: any) => {
    return library.getBalance(address).then((balance: string) => parseBalance(balance));
  };
}

export default function useETHBalance(address?: string | null, suspense = false) {
  const { provider: library, chainId } = useWeb3React();

  const shouldFetch = typeof address === "string" && !!library;

  const result = useSWR(
    shouldFetch ? [address, chainId, "ETHBalance"] : null,
    getETHBalance(library),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
