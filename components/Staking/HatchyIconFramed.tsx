import Image from 'next/image';
import { useWallet } from '../../contexts/WalletContext';
import { Hatchy } from '../../types'

interface HatchyIconFramedProps{
	hatchy: Hatchy
	className?: string
	owned?: boolean
}

export default function HatchyIconFramed({ hatchy, className, owned=true }:HatchyIconFramedProps) {
	const {gen} = useWallet();
	return (
		<div className={`group relative w-16 h-16 flex m-1 ${owned?'':'grayscale'} ${className} `} >
			<div className={`absolute inset-0 w-16 hidden hatchy-mini-selector `}>
				<div className='relative w-full h-full'>
					<Image src={"/static/effects/select.png"} alt='' layout='fill'/>
				</div>
			</div>
			<div className='m-auto relative'>
				<div className={`hatchy-image pixelate h-16 w-16 relative`} >
					<Image 
					src={`/static/hatchy-icons/gen${gen}/default/${hatchy.element}/${hatchy.name}.png`}
					alt={hatchy.name} layout='fill' unoptimized/>
				</div>
			</div>
		</div>
	)
}
