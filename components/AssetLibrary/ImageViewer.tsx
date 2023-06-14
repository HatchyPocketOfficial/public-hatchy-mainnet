import React, { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface ImageViewerProps {
	assetURL: string
}
export default function ImageViewer({assetURL}:ImageViewerProps) {
	return (
		<div className='flex flex-col justify-center items-center w-full'>
			<div className='border border-white bg-white bg-opacity-10 rounded-sm w-full h-full justify-center items-center'>
				<TransformWrapper minScale={0.5} >
					<TransformComponent wrapperClass='cursor-pointer'>
					  <img src={assetURL} alt="test" className='pixelate w-full ' />
					</TransformComponent>
				</TransformWrapper>
			</div>
		</div>
	)
}
