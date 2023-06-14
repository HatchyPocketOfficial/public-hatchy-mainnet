import { NextApiRequest, NextApiResponse } from "next";
import { METADATA_BASE_URL } from "../../../../constants";

export default function gen2EggsMetadata(req: NextApiRequest, res: NextApiResponse) {
	const id = req.query?.type as string;
	if (id === '0') {
		const solarEgg = {
			name: 'HatchyPocket Gen. 2 Eggs - Solar',
			image: `${METADATA_BASE_URL}/static/egg_Solar.gif`,
			description: 'Hatch this egg to get a Solar Hatchy.'
		}
		return res.status(200).json(solarEgg);
	} else if (id == '1') {
		const lunarEgg = {
			name: 'HatchyPocket Gen. 2 Eggs - Lunar',
			image: `${METADATA_BASE_URL}/static/egg_Lunar.gif`,
			description: 'Hatch this egg to get a Lunar Hatchy.'
		}
		return res.status(200).json(lunarEgg);
	}
	return res.status(404).json({ error: 'not found' });
}