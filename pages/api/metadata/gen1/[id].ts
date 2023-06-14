import {NextApiRequest, NextApiResponse} from "next";
import dataGen1 from "../../../../public/static/characters-gen1.json";
import { Metadatas } from "../../../../types";
const hatchiesDataGen1:Metadatas = dataGen1; 

export default function gen1MonsterMetadata(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query?.id as string;
    if(hatchiesDataGen1[id]) {
        res.status(200).json(hatchiesDataGen1[id]);
        return;
    }

    return res.status(404).json({
            error: "Not Found"
        });
}