import Link from 'next/link'
import React from 'react'
import Button from '../components/Button'
import PageLayout from '../components/PageLayout'

export default function Custom404() {
  return (
	<PageLayout className='bg-kingdom bg-cover'>
		<div className='min-h-full flex flex-col justify-center items-center py-40'>
			<span className='text-whit text-9xl py-10'> :( </span>
			<span className='text-whit text-3xl py-10'>Sorry, this page doesn&apos;t exist</span>
			<Link href='/collection_faq' passHref>
				<Button label='Return to home' onClick={()=>{}} >
				</Button>
			</Link>
		</div>
	</PageLayout>
  )
}
