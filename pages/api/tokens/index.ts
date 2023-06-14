import NextCors from 'nextjs-cors';
import {getDefaultProvider} from '@ethersproject/providers'
import {Contract} from '@ethersproject/contracts'
import {supportedNetworks} from "../../../utils";
import ABI from "../../../abi/index";
import Metadata from '../../../public/static/characters.json'
import { NextApiRequest, NextApiResponse } from 'next';
import {Tokens} from '../../../types';
import { DefaultChainID, METADATA_BASE_URL } from '../../../constants';
import { getHatchyNFTAddress } from '../../../utils/addressHelpers';
import tokens from '../../../tokens/tokens.json';
const Tokens:Tokens = tokens; 

const rpc = supportedNetworks[DefaultChainID].rpcUrls[0]
const provider = getDefaultProvider(rpc)
const contract = new Contract(getHatchyNFTAddress(), ABI.Hatchy, provider)
export default async function TokensApi(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });
  if (req.method !== "POST") {
      res.status(404)
      return
  }

  console.log('request')

  console.log(req.body)
  const tokenIds = typeof req.body == "string" ? JSON.parse(req.body || "[]") : req.body
  if (!tokenIds || tokenIds?.length == 0) {
      res.status(404).json({
          error: "Not Found"
      });
      return
  }
  let result = []
  let currentSupply = await contract.totalSupply()
  currentSupply = parseInt(currentSupply || "0")
  console.log({tokenIds})
  for (let idx = 0; idx < tokenIds.length; idx++) {
      const tokenId = tokenIds[idx].toString();
      if (parseInt(tokenId) >= parseInt(currentSupply)) {
          console.log('not minted.', tokenId)
      } else {
          const charData = Object.assign({}, Tokens[tokenId]);
          const metadata: any = Object.assign({}, Metadata[charData.c]);
          metadata.tokenId = tokenId.toString();
          metadata.id = charData.c;
          metadata.character = charData.c;
          metadata.serial = charData.sr;
          metadata.isShiny = charData.s;
          if (charData.s === 1) {
              metadata.image = `${METADATA_BASE_URL}/static/characters/${metadata.shiny}`
          } else {
              metadata.image = metadata.image = `${METADATA_BASE_URL}/static/characters/${metadata.framed}`
          }

          result.push(metadata)
      }
  }

  res.status(200).json(result)
}