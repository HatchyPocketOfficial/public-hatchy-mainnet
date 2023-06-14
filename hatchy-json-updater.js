const originalMetadata = require('./public/static/characters-gen2.json');
const originalMetadataFilename = './public/static/characters-gen2.json';
fs = require('fs');
console.log('Updating File...');

const newAPIMetadata = {};
for (const key in originalMetadata) {
	if (Object.hasOwnProperty.call(originalMetadata, key)) {
		const hatchy = originalMetadata[key];
		const newHatchyCommon = {
			...hatchy,
			image: `https://hatchypocket.com/static/cards/gen2/${hatchy.element.toLowerCase()}/${hatchy.framed.toLowerCase()}`,
			shiny: hatchy.shiny.toLowerCase(),
			framed: hatchy.framed.toLowerCase(),
		}
		newAPIMetadata[hatchy.monsterId]=newHatchyCommon;
	}
}
fs.writeFile(originalMetadataFilename, JSON.stringify(newAPIMetadata, null, 2), ()=>{console.log('Finished');});