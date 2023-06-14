import Image from 'next/image'
import React, { useState } from 'react'
import { Hatchy } from '../../types'
import Button from '../Button'
import Input from '../Input'
import ImageViewer from './ImageViewer';
import Viewer3D from './Viewer3D'
import InputFile from '../InputFile'
import { Icon } from '@iconify/react'

interface AssetCardInfoProps {
	hatchy: Hatchy
	owner: string
	offerPrice: number
	setOfferPrice: (newPrice: number) => void
}
export default function AssetCardInfo({ hatchy, owner, offerPrice, setOfferPrice }: AssetCardInfoProps) {
	const [file, setFile] = useState<string | null>(null);
	const [fileType, setFileType] = useState<string | null>(null);
	const [inputKey, setInputKey] = useState("");

	/*

				<div className="m-auto pixelate cursor-pointer hover:scale-125 ease-in duration-300 w-44 h-44 relative
				md:w-52 md:h-52">
					<Image src={`/static/characters/${hatchy.framed}`} alt={hatchy.name} layout='fill'/>
				</div>
					<AudioPlayer src='/static/test/antarcticus.wav' className='w-full' showJumpControls={false} customAdditionalControls={[]} layout="horizontal" />
					<Viewer3D assetURL='/static/test/Sharakus/Sharakus.fbx' scale={0.005} />
					<ImageViewer assetURL='/static/characters/bazub.gif' />
			{imageSrc?
				<img src={imageSrc as string}></img>
			:
				<>
				</>
			}
	*/
	const renderFileViewer = () => {
		if (file && fileType) {
			if (['png', 'jpg'].includes(fileType))
				return <ImageViewer assetURL={file} />
			if (['fbx', 'obj'].includes(fileType))
				return <Viewer3D scale={0.01} assetURL={file} />
		}
		return <></>
	}
	return (
		<div className='w-full flex flex-col
			md:flex-row'>
			<div className='border border-white flex justify-center relative
			md:w-1/3'>
				{file ?
					<>
						{renderFileViewer()}
						<button className='absolute top-0 right-0 bg-white text-gray-dark rounded-sm p-1 m-2 ' onClick={() => setFile(null)}>
							<Icon icon="ep:close-bold" width={30} />
						</button>
					</>
					:
					<InputFile setFile={(file) => setFile(file)} setFileType={(fType) => setFileType(fType)} key={inputKey} accept="image/*" />
				}
			</div>
			<div className='bg-white  flex flex-col w-full
			md:w-2/3'>
				<span className='bg-white w-full px-2 py-2 font-bold text-left text-2xl text-gray-dark2'>Upload {hatchy.name} 3D Asset</span>
				<div className='bg-gray-300 px-5 py-1 '>
					<span className='flex w-full text-left pb-2 text-gray-dark2'>By Artist {owner}</span>
					<div className='flex flex-row mb-3 space-x-5 '>
						<div className='w-10 h-10 relative'>
							<Image src={'/static/misc/check.png'} alt='Check' layout='fill' />
						</div>
						<div className='w-6 h-10 relative'>
							<Image src={'/static/misc/medal.png'} alt='Medal' layout='fill' />
						</div>
						<div className='w-8 h-10 relative'>
							<Image src={'/static/misc/shield.png'} alt='Shield' layout='fill' />
						</div>
						<div className='w-6 h-10 relative'>
							<Image src={'/static/misc/trophy.png'} alt='Trophy' layout='fill' />
						</div>
					</div>
				</div>
				<div className='bg-gray-30 p-2 text-gray-dark2 bg-white px-5'>
					<div className='flex flex-row space-x-5  justify-center mb-2'>
						<div className='flex flex-row justify-start items-center w-full my-2'>
							<span className='mr-3'>Offer Price: </span>
							<Input value={offerPrice} type='number' onChange={setOfferPrice} min={0.0} />
							<div className='w-10 h-10 relative ml-2'>
								<Image src={'/static/avax.png'} alt='Avax logo' layout='fill' />
							</div>
						</div>
					</div>
					<div className='flex flex-row justify-between'>
						<Button label='FINISH' color='green' />
					</div>
					<p className='text-red-600 mt-3'>Finish all needed information to finish adding asset</p>
				</div>
			</div>
		</div>
	)
}
