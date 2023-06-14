import type { NextPage } from 'next'
import { ReactNode, useState } from 'react'
import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import PageLayout from '../../components/PageLayout'
import { useRouter } from 'next/router'
import NavButton from './NavButton'

interface AssetLibraryLayoutProps {
	children: ReactNode
}
const AssetLibraryLayout: NextPage = ({ children }) => {
	//pages
	const [currentPage, setCurrentPage] = useState(0);
	const [userRole, setUserRole] = useState("Artist");
	const router = useRouter()

	const pages = [
		{
			label: 'Reference Library',
			route: '',
		},
		{
			label: 'Support Assets',
			route: 'support',
		},
		{
			label: 'My Assets',
			route: 'artist',
		},
		{
			label: 'Developers',
			route: 'developer',
		},
	];

	/*
		<h1 className='font-government m-6 text-center text-white text-xl'>
			LOCKED BY OWNED MONSTERS
		</h1>
	*/

	return (
		<PageLayout className='bg-purple-image bg-cover text-center'>
			<div className="flex flex-col items-center">
				<Banner title='ASSET LIBRARY' />
				<div className='flex flex-col w-full justify-center items-center max-w-7xl'>
					<div className='flex flex-col w-full justify-center items-center max-w-full px-2 mb-10
          sm:px-10 '>
						<section className='flex flex-col justify-center items-center pb-5'>
							<h1 className='bg-black text-white font-black text-2xl mb-6 py-2 w-full max-w-xs  px-10  md:w-96'>
								{userRole}
							</h1>
							<div className='flex px-0 md:px-3'>
								{pages.map(page => (
									<NavButton route={page.route} label={page.label} key={page.label} />
								))}
							</div>
						</section>
						<section className='flex flex-col justify-center border-2 border-white text-white mx-10 md:mx-20 w-full'>
							{children}
						</section>
					</div>
				</div>
				<Footer />
			</div >
		</PageLayout >
	)
}
export default AssetLibraryLayout