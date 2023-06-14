fs = require('fs');
const hatchiesDataGen1 = require("./public/static/characters-gen1.json");
const hatchiesDataGen2 = require("./public/static/characters-gen2.json");
const baseDirectory = `public/static/avatars/gen1/`;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const moveFiles = (err, files)=>{
	if (err){
		console.log(err);
		process.exit(0);
	}
	console.log('Moving files ...');

	const relations = {
		grey: 'grayscale',
		shiny: 'shiny',
		silhouette: 'silhouette',
		common: 'common'
	}
	files.forEach((filename, i)=>{
		// antarcticus_icon_common.png
		// antarcticus_icon_grey.png
		// antarcticus_icon_shiny.png
		// antarcticus_icon_silhouette.png
		const properties = filename.split('_');
		const name = capitalizeFirstLetter(properties[0]);
		const type = properties[2].split('.')[0];
		//console.log(name);
		const element = hatchiesDataGen1.find((info)=>info.name===name).element;
		const typeFolder = relations[type];
		if (typeFolder) {
			const destinationFilename = `public/static/hatchy-icons/gen1/${typeFolder}/${element}/${name}.png`
			fs.copyFileSync(baseDirectory+filename, destinationFilename);
			console.log(`${filename} was copied to ${destinationFilename}`);
		}
	});
}

//read images filenames
//console.log(baseDirectory);
//fs.readdir(baseDirectory, moveFiles)

const moveCardImages = (err, files)=>{
	if (err){
		console.log(err);
		process.exit(0);
	}
	console.log('Moving files ...');

	const rarityRelations = {
		shiny: 'shiny',
		common: 'framed'
	}
	files.forEach((filename, i)=>{
		if(filename=='jsons') return;
		console.log('---------');
		const properties = filename.split('.')[0].split('_');
		const name = properties[0];
		const rarity = properties[1];
		const element = hatchiesDataGen1.find(
			(info)=>info.name===capitalizeFirstLetter(name)
		).element;
		//move to cards folder
		const destinationFilename = `public/static/cards/gen1/${element.toLowerCase()}/${filename}`
		fs.copyFileSync(cardsBaseDirectory+filename, destinationFilename);
		console.log(`${filename} was copied to ${destinationFilename}`);
		/*
		*/
	});
}

const cardsBaseDirectory = `public/static/characters/gen1/`;
//read images filenames
console.log(cardsBaseDirectory);
fs.readdir(cardsBaseDirectory, moveCardImages);