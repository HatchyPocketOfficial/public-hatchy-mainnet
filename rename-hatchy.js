const originalMetadata = require('./public/static/characters-gen2.json');
const originalMetadataArray = require('./public/static/characters-gen2-array.json');
const cardsDirectory = './public/static/cards/gen2';
const iconsDirectory = './public/static/hatchy-icons/gen2';
const soundsDirectory = './public/static/sounds';

fs = require('fs');
const args = process.argv;
console.log(args);
if(args.length != 4){
	console.log('Please run:');
	console.log('npm run rename-hatchy CurrentName NewName');
	process.exit(0);
}
const currentName = args[2];
const newName = args[3];
// update array
const index = originalMetadataArray.findIndex(hatchy=>(hatchy.name===currentName));
if (index==-1) {
	console.log('cannot found hatchy with this name');
	process.exit(0);
}
console.log('Updating Metadata...');
const monsterId = originalMetadataArray[index].monsterId;
const element = originalMetadataArray[index].element.toLowerCase();
const elementUpperCase = originalMetadataArray[index].element;
originalMetadataArray[index].name=newName
originalMetadataArray[index].image=`${newName}_Common.png`
originalMetadataArray[index].sound=`${newName.toLowerCase()}.wav`
originalMetadataArray[index].shiny=`${newName}_shiny.gif`
originalMetadataArray[index].framed=`${newName}_framed.gif`
fs.writeFile(
	`./public/static/characters-gen2-array.json`,
	JSON.stringify(originalMetadataArray, null, 2),
	()=>{}
);
// update metadatas object
originalMetadata[monsterId].name=newName
originalMetadata[monsterId].image=`${newName}_Common.png`
originalMetadata[monsterId].sound=`${newName.toLowerCase()}.wav`
originalMetadata[monsterId].shiny=`${newName}_shiny.gif`
originalMetadata[monsterId].framed=`${newName}_framed.gif`
fs.writeFile(
	`./public/static/characters-gen2.json`,
	JSON.stringify(originalMetadata, null, 2),
	()=>{}
);
// update images
console.log('Updating Images...');
if (monsterId<137) {
	fs.rename(
		`${cardsDirectory}/${element}/${currentName.toLowerCase()}_framed.gif`,
		`${cardsDirectory}/${element}/${newName.toLowerCase()}_framed.gif`,
		(err)=> {
			if ( err ) console.log('ERROR: ' + err);
		}
	);
}
fs.rename(
	`${cardsDirectory}/${element}/${currentName.toLowerCase()}_shiny.gif`,
	`${cardsDirectory}/${element}/${newName.toLowerCase()}_shiny.gif`,
	(err)=> {
		if ( err ) console.log('ERROR: ' + err);
	}
);

const iconsTypes = ['default', 'grayscale', 'shiny', 'silhouette'];
iconsTypes.forEach(type => {
	fs.rename(
		`${iconsDirectory}/${type}/${elementUpperCase}/${currentName}.png`,
		`${iconsDirectory}/${type}/${elementUpperCase}/${newName}.png`,
		(err)=> {
			if ( err ) console.log('ERROR: ' + err);
		}
	);
});

if (fs.existsSync(`${soundsDirectory}/${currentName.toLowerCase()}.wav`)) {
	fs.rename(
		`${soundsDirectory}/${currentName.toLowerCase()}.wav`,
		`${soundsDirectory}/${newName.toLowerCase()}.wav`,
		(err)=> {
			if ( err ) console.log('ERROR: ' + err);
		}
	);
}
console.log(`Done! ${currentName} -> ${newName}`);