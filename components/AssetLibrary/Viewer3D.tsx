import { Canvas } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import React, { Suspense, useState } from 'react'
import { OrbitControls } from '@react-three/drei';

interface Viewer3DProps {
	assetURL: string
	scale: number
}

export default function Viewer3D({ assetURL, scale }: Viewer3DProps) {
	const [bgColor, setBgColor] = useState("#8bcfe2");
	const Model = () => {
		const fbx = useLoader(FBXLoader, assetURL);
		return <primitive object={fbx} scale={scale} position={[0, -2, 0]} />;
	};

	const Plane = () => {
		return (
			<mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeBufferGeometry attach='geometry' args={[100, 100]} />
				<meshLambertMaterial attach='material' color={'#72AF54'} />
			</mesh>
		)
	}
	return (
		<div className='flex flex-col items-center w-full'>
			{/**<input type={"color"} value={bgColor} onChange={(e)=>setBgColor(e.target.value)} /> */}
			<div className='h-80 w-full border border-white bg-white bg-opacity-10 rounded-sm'>
				<Canvas>
					<Suspense fallback={null}>
						<ambientLight intensity={0.7} />
						<directionalLight castShadow color="white" position={[5, 0, 5]} intensity={0.5} />
						<perspectiveCamera position={[2, 2, 2]} />
						<Model />
						<OrbitControls makeDefault />
					</Suspense>
				</Canvas>
			</div>
		</div>
	)
}
