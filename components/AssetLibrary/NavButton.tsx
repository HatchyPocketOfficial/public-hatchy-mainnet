import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
interface NavButtonProps {
	route: string
	label: string
}
export default function NavButton({route, label}:NavButtonProps) {
	const router = useRouter()
	const selected = router.pathname === '/asset_library/'+route || router.pathname=== '/asset_library' && route=='' 
	return (
		<button className={`border border-white   w-auto md:w-48 font-bold
		${selected?'bg-white text-black':'bg-black bg-opacity-40 text-white hover:bg-opacity-60 '} `}>
			<Link href={`/asset_library/${route}`} >
				<a className='w-full h-full flex justify-center items-center px-2  py-2'>{label}</a>
			</Link>
		</button>
	)
}
