import { useWeb3React } from '@web3-react/core'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import LoadingSpinner from '../components/Utility/LoadingSpinner'
import PageLayout from '../components/PageLayout'
import { useAccount } from '../contexts/AccountContext'
import useLogin from '../hooks/Accounts/useLogin'
import ConnectWalletModalWrapper from '../components/WalletConnect/ConnectWalletModalWrapper'

export default function InviteReferralPage() {
    const [loginError, setLoginError] = useState<string>();
    const router = useRouter();
	const { setUserInfo } = useAccount();
	const { loginReferral, loadingLogging } = useLogin(setUserInfo);
  	const { account, provider } = useWeb3React();

    useEffect(() => {
        const token= router.query.data;
        if(!token){
            // Router.push('/') 
            return;
        }
        
        if (token && account && provider) {
            loginReferral(token as string)
            .then((resLogin)=>{
				if (resLogin.code === 200) {
                    console.log("logged!");
                    Router.push('/account');
                }else{
                    setLoginError(resLogin.data.message);
                }
            })
            .catch((e)=>{
                setLoginError("An error has occurred");
            });
        }
    }, [router.query, account, provider])
    
    const goToAccount = () => Router.push('/account');
    const goToHome = () => Router.push('/');
    
    const renderMessage = ()=>{
        if(router.query.data){
            if(loginError){
                return (
                    <>
                        <span className='my-5 text-xl font-bold text-red-700'>{loginError}</span>
                        <Button label='Go to home' onClick={goToHome}/>
                    </>
                )
            }
            if(!account){
                return (
                    <>
					    <ConnectWalletModalWrapper />
                    </>
                )
            }
            return (
                <>
                    <LoadingSpinner />
                    <span className='mt-5 text-xl font-bold'>Logging in...</span>
                </>
            )
        }
        return (
            <>
                <span className='my-5 text-xl font-bold text-red-700'>Missing data in url</span>
                <Button label='Go to home' onClick={goToHome}/>
            </>
        )
    }

    return (
        <PageLayout>
            <div className='bg-cyan h-screen flex flex-col items-center'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-white flex flex-col justify-center items-center mt-80'>
                        {renderMessage()}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
