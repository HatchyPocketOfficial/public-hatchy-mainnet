import type { NextLayoutComponentType } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PageLayout from '../../components/PageLayout'
import { AdminContextProvider, useAdmin } from '../../contexts/AdminContext'
import { displayError } from '../../utils/ErrorMessage'

const AdminSignUpPage: NextLayoutComponentType = () => {
	const {signup} = useAdmin();
	const router = useRouter();
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	const signUpAux = ()=>{
		console.log('sign up with ', name, ',', username, 'and', password);
		signup(name, username, password).then((res: any)=>{
			if(res.code==200) router.push('/admin');
			else displayError(res.message);
		}).catch;
	}

	return (
		<PageLayout className={"text-center"}>
			<div className="bg-dao bg-cover w-auto h-screen text-center pt-0 flex flex-col items-center text-white">
				<Banner title='ADMIN' />
				<div className='flex flex-col'>
					<div className='flex flex-col w-40'>
						<span>Name</span>
						<Input value={name} onChange={setName} className='w-full' />
					</div>
					<div className='flex flex-col w-40'>
						<span>Username</span>
						<Input value={username} onChange={setUsername} className='w-full' />
					</div>
					<div className='flex flex-col w-40'>
						<span>Password</span>
						<Input value={password} onChange={setPassword} className='w-full' 
						type={'password'} onEnterKeyDown={signUpAux} />
					</div>
					<Button label='Sign Up' onClick={signUpAux} />
				</div>
			</div>
		</PageLayout>
	)
}

AdminSignUpPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<AdminContextProvider>
			{page}
		</AdminContextProvider>
	);
};

export default AdminSignUpPage

