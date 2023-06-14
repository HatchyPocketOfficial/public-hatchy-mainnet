import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

export default function MiniNavbar() {
	const router = useRouter();
	const pages = [
		{
			label: 'Home',
			route: 'home',
		}, 
		{
			label: 'Games',
			route: 'games',
		}, 
		{
			label: 'FAQ',
			route: 'faq',
		}, 
		{
			label: 'DAO',
			route: 'dao',
		}, 
	];
	const displayPages = ['/home', '/games', '/faq', '/dao', '/'];
	
	if (!displayPages.includes(router.pathname)) return <></>
	return (
		<div className='px-0 md:px-3 top-20 z-0 absolute flex justify-center items-center w-full pt-2'>
			{pages.map(page=>{
				const selected = router.pathname.includes(page.route) || router.pathname=='/' && page.label=='Home';
				return (
				<button className={`border border-white w-20 md:w-28 font-bold
					${selected?'bg-white text-black':'bg-black bg-opacity-40 text-white hover:bg-opacity-60 '} `}
					key={page.label}>
						<Link href={`/${page.route}`} >
								<a className='flex justify-center w-full'>{page.label}</a>
						</Link>
					</button>
				)
			})}
			<button className={`border border-white w-20 md:w-28 font-bold
			bg-black bg-opacity-40 text-white hover:bg-opacity-60`}
			>
				<a className='flex justify-center w-full'
					href='https://docs.hatchypocket.com'
					target='_blank'
					rel='noreferrer'>
					Docs
				</a>
			</button>
		</div>
	)
}
