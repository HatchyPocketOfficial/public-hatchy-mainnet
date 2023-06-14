import type { NextLayoutComponentType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PageLayout from '../../components/PageLayout'
import LoadingSpinnerPage from '../../components/Utility/LoadingSpinnerPage'
import { AdminContextProvider, useAdmin } from '../../contexts/AdminContext'
import { getAdminToken } from '../../utils/accounts'
import { displayError } from '../../utils/ErrorMessage'

const AdminLoginPage: NextLayoutComponentType = () => {
	const {login} = useAdmin();
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	const loginAux = ()=>{
		login(username, password).then((res: any)=>{
			if(res.code==200) router.push('/admin');
			else displayError(res.message);
		}).catch;
	}
	
	useEffect(() => {
		if(getAdminToken()!=null){
			router.push('/admin');
		}
	}, [router]);

	if(getAdminToken()!=null){
		return (
			<PageLayout>
				<LoadingSpinnerPage />
			</PageLayout>
		)
	}
	return (
		<PageLayout className='text-center'>
			<div className="bg-dao bg-cover w-auto h-screen text-center pt-0 flex flex-col items-center text-white">
				<Banner title='ADMIN' />
				<div className='flex flex-col'>
					<div className='flex flex-col w-40'>
						<span>Username</span>
						<Input value={username} onChange={setUsername} className='w-full' />
					</div>
					<div className='flex flex-col w-40'>
						<span>Password</span>
						<Input value={password} onChange={setPassword} 
						className='w-full' type={'password'}
						onEnterKeyDown={loginAux} />
					</div>
					<Button label='Login' onClick={loginAux} />
					<Link href={'/admin/signup'}>
						Sign up
					</Link>
				</div>
			</div>
		</PageLayout>
	)
}

AdminLoginPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<AdminContextProvider>
			{page}
		</AdminContextProvider>
	);
};

export default AdminLoginPage

