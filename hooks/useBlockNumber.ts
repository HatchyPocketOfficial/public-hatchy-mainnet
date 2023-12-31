import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";

function getBlockNumber(library: any) {
  return async () => {
    return library.getBlockNumber();
  };
}

export default function useBlockNumber() {
  const { provider: library } = useWeb3React();
  const shouldFetch = !!library;

  return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(library), {
    refreshInterval: 10 * 1000,
  });
}
