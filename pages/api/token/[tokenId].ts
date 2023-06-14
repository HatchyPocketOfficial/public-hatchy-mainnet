import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { supportedNetworks } from "../../../utils";
import ABI from "../../../abi/index";
import tokens from '../../../tokens/tokens.json';
import Metadata from '../../../public/static/characters.json';
import NextCors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { DefaultChainID, METADATA_BASE_URL } from '../../../constants';
import { getHatchyNFTAddress } from '../../../utils/addressHelpers';
import { Tokens } from '../../../types';
const Tokens: Tokens = tokens;
const rpc = supportedNetworks[DefaultChainID].rpcUrls[0]
const provider = new JsonRpcProvider(rpc)
const contract = new Contract(getHatchyNFTAddress(), ABI.Hatchy, provider)

export default async function TokenIdApi(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    let { tokenId: tokenIdQuery } = req.query;
    if (!tokenIdQuery) {
        res.status(404).json({
            error: "Not Found"
        });
        return
    }
    const tokenId = parseInt(tokenIdQuery as string)
    console.log({ tokenId })
    const currentSupply = await contract.totalSupply()
    if (tokenId >= parseInt(currentSupply)) {
        res.status(404).json({
            error: "NOT CLAIMED OR NOT EXIST"
        })
        return
    }

    const charData = Object.assign({}, Tokens[tokenId]);
    console.log({ charData })
    console.log(Metadata[charData.c])
    console.log(charData.c)
    const metadata: any = Object.assign({}, Metadata[charData.c]);
    console.log({ metadata })
    if (charData.s === 1) {
        metadata.image = `${METADATA_BASE_URL}/static/cards/gen1/${metadata.element?.toLowerCase()}/${metadata.shiny}`
    } else {
        metadata.image = metadata.image = `${METADATA_BASE_URL}/static/cards/gen1/${metadata.element?.toLowerCase()}/${metadata.framed}`
    }
    metadata.attributes = [
        {
            "trait_type": "Shiny",
            "value": charData.s === 1
        },
        {
            "trait_type": "Element",
            "value": metadata.element
        },
        {
            "trait_type": "Height",
            "value": metadata.height
        },
        {
            "trait_type": "Weight",
            "value": metadata.weight
        }
    ]
    metadata.tokenId = tokenId;
    metadata.id = charData.c;
    metadata.character = charData.c;
    metadata.serial = charData.sr;
    metadata.isShiny = charData.s;
    res.status(200).json(metadata)
}