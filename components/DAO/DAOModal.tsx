import { Icon } from '@iconify/react';
import React from 'react'
import Modal, { ModalProps } from '../Modal';

interface DAOModalProps extends ModalProps {

}

export default function DAOModal({ ...modalProps }: DAOModalProps) {
	const appNames = [
		'app1',
		'app2',
		'app3',
		'app4',
		'app5',
		'app6',
	]
	return (
		<Modal {...modalProps} className='bg-cyan'>
			<div className='text-white'>
				<div className='flex justify-between w-full lg:pl-5'>
					<h3>Ranking</h3>
					<button onClick={modalProps.closeModal}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div className='flex flex-col  lg:px-20'>
					{/*Marketcap and Users quantities*/}
					<div className='flex flex-col h-auto claim-egg border-4 border-white relative items-center justify-center py-2 
		            md:flex-row md:w-auto '>
						<div className='flex-col w-auto h-auto m-1'>
							<h1 className='bg-yellow text-gray-dark text-5xl p-5'>
								000M
							</h1>
							<p className='text-white'>
								Marketcap
							</p>
						</div>
						<div className='flex-col w-auto h-auto m-1 text-center'>
							<h1 className='bg-yellow text-gray-dark text-5xl p-5'>
								000M
							</h1>
							<p className='text-white'>
								Users
							</p>
						</div>
						<div className='flex-col w-auto h-auto m-1 text-center'>
							<h1 className='bg-yellow text-gray-dark text-5xl p-5'>
								000M
							</h1>
							<p className='text-white'>
								Assets
							</p>
						</div>
					</div>
					{/*Table */}
					<table className='my-5'>
						<tbody>
							<tr className='odd:bg-gray-dark2 even:bg-gray-dark'>
								<th colSpan={2} className='py-1 border border-gray' >Rank</th>
								<th className='border border-gray'>User</th>
							</tr>
							{appNames.map(app => (
								<tr className='odd:bg-gray-dark2 even:bg-gray-dark ' key={app}>
									<td className='border border-gray'>000</td>
									<td className='border border-gray'>{app}</td>
									<td className='border border-gray'>00</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='font-government text-white '>
						<span>DO YOU WANT TO START YOUR OWN PROJECT?</span>
						<p>
							<span>COMING SOON ASSET LIBRARY</span>
							{/*
								<a href='asset_library'  className='text-black underline'>ASSET LIBRARY</a>
							*/}
						</p>
					</div>
				</div>
			</div>
		</Modal>
	)
}
