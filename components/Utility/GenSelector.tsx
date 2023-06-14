import React from 'react'
import { useWallet } from '../../contexts/WalletContext'

interface GenSelectorProps {
	showNewPopup?: boolean
	onChange?: Function
}
export default function GenSelector({showNewPopup=false, onChange=()=>{}}:GenSelectorProps) {
	const {gen, setGen } = useWallet();
  return (
	<div className='flex flex-row text-white w-full py-1 px-0 justify-center items-center text-center'>
		<div className='flex flex-row w-60 items-center justify-center text-center  bg-gray-dark2 bg-opacity-60'>
			<button
				onClick={() => {
					setGen(gen - 1)
					onChange()
				}}
				className={`w-10 justify-center flex ${gen<=1?'invisible':''}`}
				disabled={gen<=1}>
				◄
			</button>
			<span className='w-full text-xl font-bold'>
				{`Hatchy Gen ${gen}`}
			</span>
			<button
				onClick={() =>{
					setGen(gen + 1)
					onChange()
				}}
				className={`w-10 justify-center flex relative ${gen>=2?'invisible':''}`}
				disabled={gen>=2}>
				►
				{showNewPopup &&
					<span className='absolute -top-8 -right-14 font-bold text-light w-32 animate-bounce
					bg-fire rounded-full
					md:-right-20'>
						NEW GEN 2!
					</span>
				}
			</button>
		</div>
		
	</div>
  )
}
