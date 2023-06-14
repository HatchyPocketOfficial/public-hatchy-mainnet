import { Icon } from '@iconify/react'
import React from 'react'

export default function AssetContent() {
	const files = [
		'file1',
		'file2',
		'file3',
		'file4',
		'file5',
		'file6',
		'file7',
		'file8',
	]

	return (
		<div className='p-2 md:p-8'>
			<span className='text-2xl font-bold '>Files</span>
			{/*Files table */}
			<div className='max-h-60 overflow-y-auto mb-2 mt-3'>
				<table className=' w-full'>
					<thead>
						<tr className='odd:bg-gray-dark2 even:bg-gray-dark'>
							<th className='py-1 border border-gray' >Name</th>
							<th className='border border-gray'>Type</th>
							<th className='border border-gray'>Size</th>
							<th className='border border-gray' colSpan={2}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{files.map(event => (
							<tr className='odd:bg-gray-dark2 even:bg-gray-dark ' key={event}>
								<td className='border border-gray text-center'>{event}</td>
								<td className='border border-gray text-center'>PNG</td>
								<td className='border border-gray text-center'>100kb</td>
								<td className='border border-gray' align='center' valign='middle'>
									<button className='flex justify-center items-center py-2'>
										<Icon icon="akar-icons:eye" width={25} />
									</button>
								</td>
								<td className='border border-gray' align='center' valign='middle'>
									<button className='flex justify-center items-center'>
										<Icon icon="bxs:download" width={25} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
