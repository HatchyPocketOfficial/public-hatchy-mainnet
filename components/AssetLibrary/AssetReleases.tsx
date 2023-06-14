import React, { useState } from 'react'
import TextArea from '../TextArea'

export default function AssetReleases() {
	const [selectedRelease, setSelectedRelease] = useState(0);
	/*
	const releases:any = [];
	*/
	const releases = [
		{
			name: 'Original',
			note: 'Original Note'
		},
		{
			name: 'Release 1.2',
			note: 'Note for release 1.2'
		},
		{
			name: 'Release 1.3',
			note: 'Latest Note'
		},
	]
	return (
		<div className='flex flex-col p-2 md:p-5 md:flex-row'>
			<div className='flex flex-col w-full md:w-1/3'>
				{releases.length>0 ? 
					releases.map((release:any,i:number)=>(
						<button className={`${i===selectedRelease?'bg-gray-300':'bg-white'} text-gray-dark2 py-1 hover:bg-gray-400 border border-b-0 border-gray-dark`}
						onClick={()=>setSelectedRelease(i)} key={release.name}>
							{release.name}		
						</button>
					))
					:
					<span>You don&apos;t have any release</span>
				}
			</div>
			{releases.length>0 ?
				<div className='flex flex-col w-full h-full'>
					<span className='text-xl'>{releases[selectedRelease].name}</span>
					<span className='border border-white h-10'>
						{releases[selectedRelease].note}
					</span>
				</div>
			:
				<TextArea placeholder='Type to add release note' />
			}
		</div>
	)
}
