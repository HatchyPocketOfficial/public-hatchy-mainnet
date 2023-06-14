import React, { useState } from 'react'
import ButtonFilter from '../ButtonFilter'
import CollectionGrid from '../Home/CollectionGrid'
import HatchiesData from "../../public/static/characters.json"

export default function AssetFilter() {
	const hatchyKeys = Object.keys(HatchiesData);
	const [selectedHatchyID, setSelectedHatchyID] = useState(1);
	const currentHatchy = HatchiesData[selectedHatchyID]
	
	const [selectedAssetTypeFilter, setSelectedAssetTypeFilter] = useState(0);
	const assetTypeFilters = [
		'2D', '3D', 'Audio'
	]
	
	//3D models filter
	const [selectedModelFilter, setSelectedModelFilter] = useState(0);
	const modelFilters = [
		'Sculpt',
		'Low Poly',
		'High Poly'
	]

	return (
		<div className='flex justify-center items-center flex-col'>
				<div className='bg-white bg-opacity-20 w-full'>
					<CollectionGrid setSelectedHatchyID={setSelectedHatchyID} rowClassName='xl:px-0' selectedHatchy={currentHatchy.monsterId} />
				</div>
				<div className='flex py-4'>
					{assetTypeFilters.map((type,i)=>(
						<ButtonFilter label={type} selected={i==selectedAssetTypeFilter} className='mx-2 w-16 md:w-24' 
						key={type} onClick={()=>setSelectedAssetTypeFilter(i)} />
					))}
				</div>
				{selectedAssetTypeFilter===1 &&
					<div className='flex pb-4'>
						{modelFilters.map((type,i)=>(
							<ButtonFilter label={type} selected={i==selectedModelFilter} className='w-auto' 
							key={type} onClick={()=>setSelectedModelFilter(i)} />
						))}
					</div>
				}
		</div>
	)
}
