const originalMetadata = require('./public/static/characters-gen2.json');
const apiMetadata = require('./public/static/gen2APIMetadata.json');
const apiMetadataFilename = './public/static/gen2APIMetadata.json';
fs = require('fs');
console.log('Updating File...');

for (const key in apiMetadata) {
	if (Object.hasOwnProperty.call(apiMetadata, key)) {
		const hatchy = apiMetadata[key];
		const updatedHatchy = originalMetadata[hatchy.monsterId];
		// console.log('previous data:', hatchy.monsterId, hatchy.height, );
		// console.log('updated: ', updatedHatchy.monsterId, updatedHatchy.height);
		hatchy.weight = updatedHatchy.weight;
		hatchy.height = updatedHatchy.height;
		hatchy.attributes[1]= {
      "trait_type": "Height",
      "value": updatedHatchy.height
		}
		hatchy.attributes[2]= {
      "trait_type": "Weight",
      "value": updatedHatchy.weight
		}
		/*
		const id = hatchy.monsterId;
		let attributes = [
			{"trait_type":"Rarity","value":"Common"},
			{"trait_type":"Height","value":hatchy.height},
			{"trait_type":"Weight","value":hatchy.weight},
			{"trait_type":"Element","value":hatchy.element},
			{"trait_type":"MonsterID","value":id}
		];
		if (id<137) { // elemental set
			const newHatchyCommon = {
				...hatchy,
				image: `https://hatchypocket.com/static/cards/gen2/${hatchy.element.toLowerCase()}/${hatchy.framed.toLowerCase()}`,
				shiny: hatchy.shiny.toLowerCase(),
				framed: hatchy.framed.toLowerCase(),
				attributes
			}
			apiMetadata[id]=newHatchyCommon;
		}
		// shiny
		const idShiny = `${id}888`;
		attributes[0].value="Shiny"
		const newHatchyShinny = {
			...hatchy,
			image: `https://hatchypocket.com/static/cards/gen2/${hatchy.element.toLowerCase()}/${hatchy.shiny.toLowerCase()}`,
			shiny: hatchy.shiny.toLowerCase(),
			framed: hatchy.framed.toLowerCase(),
			rarity: "Shiny",
			attributes
		}
		apiMetadata[id<143?idShiny:id]=newHatchyShinny;
		*/
	}
}
fs.writeFile(apiMetadataFilename, JSON.stringify(apiMetadata, null, 4), ()=>{console.log('Finished');});