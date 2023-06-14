import React from 'react'
import TextArea from '../TextArea'

export default function AssetOverview() {
	const history = [
		'event1',
		'event2',
		'event3',
	]
	return (
		<div className='flex flex-col p-2 md:p-8'>
			<span className='text-xl text-left'>Description</span>
			{/*TextArea */}
			<TextArea placeholder='Enter description here' />
			<div className='flex flex-col space-y-3 my-3
			md:flex-row md:space-x-2 md:space-y-0 '>
				<div className='w-full md:w-1/2'>
					<span className='text-xl'>Properties</span>
					<div className='bg-white bg-opacity-30 px-2 py-1'>
						<div className='flex flex-row justify-between'>
							<span>shiny:</span>
							<span>false</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span>Element:</span>
							<span>water</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span>Type:</span>
							<span>Monster Art</span>
						</div>
					</div>
				</div>
				<div className='w-full md:w-1/2'>
					<span className='text-xl'>Asset Details</span>
					<div className='bg-white bg-opacity-30 px-2 py-1'>
						<div className='flex flex-row justify-between'>
							<span>Size:</span>
							<span>344 kb</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span>Dimension:</span>
							<span>140 x 140 px</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span>Format:</span>
							<span>GIF</span>
						</div>
					</div>

				</div>
			</div>
			{/*Table History */}
			<span className='self-start text-xl'>History</span>
			<table className='w-full'>
				<thead>
			  		<tr className='odd:bg-gray-dark2 even:bg-gray-dark'>
			  		  <th className='py-1 border border-gray' >Event</th>
			  		  <th className='border border-gray'>Price</th>
			  		  <th className='border border-gray'>From</th>
			  		  <th className='border border-gray'>To</th>
			  		  <th className='border border-gray'>Date</th>
			  		</tr>
				</thead>
				<tbody>
			 	 	{history.map(event=>(
			 	 		<tr className='odd:bg-gray-dark2 even:bg-gray-dark ' key={event}>
			 	 		  <td className='border border-gray text-center'>{event}</td>
			 	 		  <td className='border border-gray text-center'>1</td>
			 	 		  <td className='border border-gray text-center'>00</td>
			 	 		  <td className='border border-gray text-center'>00</td>
			 	 		  <td className='border border-gray text-center'>@1</td>
			 	 		</tr>
			 	 	))}
				</tbody>
			</table> 
		</div>
	)
}
