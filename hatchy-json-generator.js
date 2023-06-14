fs = require('fs');
const metadataGen2 = require("./public/static/characters-gen2.json");
const metadataGen1 = require("./public/static/characters-gen1.json");

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateFile = ()=>{
	const filename = `public/static/characters-gen1-generated.json`;
	console.log('Writing File...');
	const data = {};
	metadataGen1.forEach(hatchy => {
		data[hatchy.monsterId]=hatchy	
	});
	fs.writeFile(filename, JSON.stringify(data, null, 2), ()=>{console.log('Finished');});
}
generateFile();