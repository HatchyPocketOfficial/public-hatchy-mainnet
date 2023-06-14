import React from 'react'
import { displayWarn } from '../../utils/ErrorMessage';
interface QuantitySelectorProps{
	quantity: string
	setQuantity: (q:string)=>void
	min: number,
	max: number,
	warningEnabled?: boolean,
	warnMessage?: string,
	className?: string
}
export default function QuantitySelector({
	quantity,
	setQuantity,
	min,
	max,
	warningEnabled=false,
	warnMessage='You can only buy max. 20 hatchies per transaction',
	className
}: QuantitySelectorProps) {
	const quantityNumber =parseInt(quantity);
	const canDecrease = quantityNumber>min && quantity!=='';
	const canIncrease = quantityNumber<max && quantity!=='';
	const validateQuantity = (quantityStr: string) =>{
		quantityStr= quantityStr.replace(/\D/,'');
		const quantityNum = parseInt(quantityStr);
		if (quantityNum < min) return
		if (quantityNum > max){
			if (warningEnabled) displayWarn(warnMessage)
			return;
		}
		setQuantity(quantityStr)
	}
	return (
		<div className={`flex flex-row justify-between py-3 text-xl ${className}`}>
			<button className={`btn-adjust-quantity
			${canDecrease?'':'grayscale'}`}
			disabled={!canDecrease}
				onClick={() => validateQuantity((quantityNumber - 1).toString())}>
				-
			</button>
			<input
				className='appearance-none w-20 bg-transparent border-b-2 border-black
				text-2xl font-black text-center'
				value={quantity}
				onChange={e=>validateQuantity(e.target.value)}
			/>
			<button className={`btn-adjust-quantity
				${canIncrease?'':'grayscale'}`}
				disabled={!canIncrease}
				onClick={() => validateQuantity((quantityNumber + 1).toString())}>
				+
			</button>
		</div>
	)
}
