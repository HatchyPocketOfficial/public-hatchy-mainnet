import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface NavbarItemProps{
	route: string
	label: string
}
export default function NavbarItem({route, label}:NavbarItemProps) {
	const displayPages = ['/home', '/ecosystem_games', '/faq', '/dao', '/'];
	const router = useRouter()
	const selected = router.pathname.includes(route) || 
										(label=='Home' && displayPages.includes(router.pathname));
	return (
        <div className={`nav-item h-14 w-32 px-3 flex justify-center text-center items-center
        	lg:w-[7.5rem] lg:h-14 ${selected ? "active" : ''} `} >
            <Link href={`/${route}`} >
                <a className='w-full h-full flex justify-center items-center '>{label}</a>
            </Link>
        </div>
	  )
}
