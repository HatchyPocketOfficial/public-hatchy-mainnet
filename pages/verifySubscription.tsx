import Image from 'next/image'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import LoadingSpinner from '../components/Utility/LoadingSpinner'
import PageLayout from '../components/PageLayout'
import useJoinMailingList from '../hooks/Accounts/useJoinMailingList'

export default function VerifySubscriptionPage() {
    const [verified, setVerified] = useState(false);
    const [verificationError, setVerificationError] = useState();
    const {verifySubscription} = useJoinMailingList(); 
    const router = useRouter();

    useEffect(() => {
        const data= router.query.data;
        const email= router.query.email;
        if(!data || !email){
            // Router.push('/') 
            return;
        }
        verifySubscription(email as string, data as string)
        .then((res)=>{
            if(res?.data.code==200){
                console.log(res);
                setVerified(true);
            }else{
                setVerificationError(res?.data.message);
            }
        })
        .catch((e)=>{
            console.log(e);
        });
    }, [router.query, verifySubscription])
    
    const goToHome = () => Router.push('/');
    
    const renderMessage = ()=>{
        if(router.query.data){
            if(verificationError){
                return (
                    <>
                        <span className='my-5 text-xl font-bold text-red-700'>{verificationError}</span>
                        <Button label='Go to home' onClick={goToHome}/>
                    </>
                )
            }
            return (
                <>
                    <LoadingSpinner />
                    <span className='mt-5 text-xl font-bold'>Verifying your email</span>
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
                        {verified?
                            <>
                                <h1 className='text-white text-6xl font-bold m-20'>
                                    Congratulations!
                                </h1>
                                <div className='w-80 h-48 relative'>
                                    <Image src={"/hatchy_logo.png"} alt='hatchy pockets logo' layout='fill' />
                                </div>
                                <h2 className='text-white text-2xl font-medium m-20'>
                                    Thank you for verifying your email
                                </h2>
                                <Button label='Go to home' onClick={goToHome}/>
                            </>
                        :
                            <div className='text-white flex flex-col justify-center items-center mt-80'>
                                {renderMessage()}
                            </div>
                        }
                    </div>
            </div>
        </PageLayout>
    )
}
