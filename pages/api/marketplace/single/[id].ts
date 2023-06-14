import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import axios from "axios";
import NextCors from 'nextjs-cors';

const SubgraphURI = `https://api.thegraph.com/subgraphs/name/hatchypocket/marketplace`

export default async function MarketplaceAPISingle(req: NextApiRequest, res:NextApiResponse) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    let { id } = req.query;

    let q = getQuery(id)
    const { data } = await axios.post(SubgraphURI, {
        query: q
    })
    console.log({ err: data?.errors })
    if (!data?.data?.hatchies) {
        res.status(404)
        return
    }
    console.log({ data: data?.data?.hatchies })
    res.status(200).json(data.data.hatchies)
}


function getQuery(id: any) {
    return `
        {
           hatchies ( 
           where: {
            id:${id},
            isOnSale: true})
                {
                    id
                    name
                    element
                    monsterId
                    tokenId
                    character
                    serial
                    isShiny
                    owner
                    isOnSale
                    price
                  }
              }
    `
}