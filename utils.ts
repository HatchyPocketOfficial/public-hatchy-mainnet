import { NextApiRequest, NextApiResponse } from "next";

export function shortenHex(hex:string, length = 4) {
    return `${hex.substring(0, length + 2)}…${hex.substring(
        hex.length - length
    )}`;
}
const ETHERSCAN_PREFIXES = {
    1: "",
    3: "ropsten.",
    4: "rinkeby.",
    5: "goerli.",
    42: "kovan.",
};

/**
 *
 * @param {("Account"|"Transaction")} type
 * @param {[number, string]} data
 */
export function formatEtherscanLink(
	type: "Account" | "Transaction", 
	data: any
) {
    switch (type) {
        case "Account": {
            const [chainId, address] = data;
            return `https://cchain.explorer.avax.network/address/${address}`;
        }
        case "Transaction": {
            const [chainId, hash] = data;
            return `https://cchain.explorer.avax.network/tx/${hash}`;
        }
    }
}

/**
 * @name parseBalance
 *
 * @param {import("@ethersproject/bignumber").BigNumberish} balance
 * @param {number} decimals
 * @param {number} decimalsToDisplay
 *
 * @returns {string}
 * Already declared in numberFormatterHelper
 */
//export const parseBalance = (balance: BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
    //Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);


export const supportedNetworks = {
    43113: {
        chainId: "0xa869",
        chainName: "Avalanche Testnet FUJI",
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
        },
        rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://testnet.explorer.avax.network/"]
    },
    43114: {
        chainId: "0xa86a",
        chainName: "Avalanche Mainnet C-Chain",
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://cchain.explorer.avax.network/"]
    },
};

export const HATCHY_CONTRACT = "0x76dAAaf7711f0Dc2a34BCA5e13796B7c5D862B53";
export const MAX_HATCHIES = 40000;
export const APP_URL = "https://hatchypocket.com"
export const appChainId = 43114;

/*
export function initMiddleware(
	middleware:NextMiddleware
) {
    return (req: NextRequest, res: NextResponse) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result:Error) => {
                if (result instanceof Error) {
                    return reject(result)
                }
                return resolve(result)
            })
        })
}
*/

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function initMiddleware(req:NextApiRequest, res:NextApiResponse, fn:Function) {
  return new Promise((resolve, reject) => {
    if (fn) {
        fn(req, res, (result:any) => {
          if (result instanceof Error) {
            return reject(result)
          }

          return resolve(result)
        })
    }
  })
}

// detect metamask mobile browser
export const isMobileDevice =()=>{
	return "ontouchstart" in window || "onmsgesturechange" in window;
}