import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import AssetCardInfo from './AssetCardInfo'
import Button from '../Button'
import ButtonFilter from '../ButtonFilter'
import Modal, { ModalProps } from '../Modal'
import HatchiesData from "../../public/static/characters.json";
import AssetCardSmall from './AssetCardSmall'
import AssetOverview from './AssetOverview'
import AssetContent from './AssetContent'
import AssetReleases from './AssetReleases'
import AssetReview from './AssetReview'

interface AssetModalProps extends ModalProps {

}
export default function AssetModal({ ...modalProps }:AssetModalProps) {
	const [selectedOption, setSelectedOption] = useState(0);

	const options =[
		{
			component: AssetOverview,
			label: 'Overview'
		},
		{
			component: AssetContent,
			label: 'Content'
		},
		{
			component: AssetReleases,
			label: 'Releases'
		},
		{
			component: AssetReview,
			label: 'Review'
		},
	]
	
	function onChangeSelected(i:number) {
		setSelectedOption(i);
	}

	{/**Render Option component */}
	const renderComponent = (selectedOption: number)=>{
		const ComponentRender =options[selectedOption].component;
		return <ComponentRender />
	}

	return (
		<Modal {...modalProps} className='bg-cyan max-h-full h-4/5 text-white border-white border relative overflow-y-auto pt-8'>
			<div className='flex justify-end w-full  absolute top-1 right-1 '>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<div className='pt-8 h-full overflow-y-auto'>
				<section className='flex flex-col  md:px-5'>
					{/*AssetCard */}
					<AssetCardInfo hatchy={HatchiesData[1]} owner={'0x1241235'} offerPrice={1000} setOfferPrice={()=>{}} />
					<Button label='Report' className='self-start my-3 px-3 pt-1 pb-1 tex-xs' />
					<span className='text-xl self-center py-3'>Overview</span>
					{/*Navigation */}
					<div className='flex flex-wrap '>
						{options.map((opt, i)=>(
     	           			<ButtonFilter label={opt.label} key={opt.label} selected={selectedOption===i} 
     	            	 		onClick={()=>onChangeSelected(i)} />
						))}
					</div>
					<div className='border border-white flex flex-col px-3 py-2	'>
						{renderComponent(selectedOption)}
					</div>
					<span className='text-xl mb-1 mt-5'>More assets from 0x123456789</span>
					<div className='flex flex-row space-x-4 overflow-x-auto mb-5'>
						<AssetCardSmall hatchy={HatchiesData[1]} fileSize={'54MB'} stars={5}/>
						<AssetCardSmall hatchy={HatchiesData[2]} fileSize={'54MB'} stars={5}/>
						<AssetCardSmall hatchy={HatchiesData[3]} fileSize={'54MB'} stars={5}/>
						<AssetCardSmall hatchy={HatchiesData[4]} fileSize={'54MB'} stars={5}/>
					</div>
				</section>
			</div>
		</Modal>
	)
}
