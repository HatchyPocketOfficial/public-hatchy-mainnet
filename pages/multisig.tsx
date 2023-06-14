import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingModal from '../components/LoadingModal'
import PageLayout from '../components/PageLayout'
import TextArea from '../components/TextArea'
import { useStake } from '../contexts/StakeContext'
import { useActiveWeb3React } from '../hooks'
import { displaySuccess, displayWarn } from '../utils/ErrorMessage'


const MultisigPage: NextPage = () => {
	const {signTokens} = useStake();
	const {account} = useActiveWeb3React();
	const [address, setAddress] = useState(account || '');
	const [tokensString, setTokensString] = useState('');
	const [params, setParams] = useState('');
	const [loading, setLoading] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const signTokenIDs = ()=>{
		if (address==null || address=='') {
			displayWarn('Fill address field before sign');
			return;
		}
		if (tokensString==null || tokensString=='') {
			displayWarn('token IDs cannot be empty');
			return;
		}
		const ids = (tokensString.replace(/ /g,'')).split(',');
		if (ids.length==0) {
			displayWarn('token IDs cannot be empty');
			return;
		}

		setLoading(true);
		signTokens(address, ids).then((data)=>{
			let paramsString = '[\n';
			data?.forEach((tuple,i)=>{
				paramsString+=`[${tuple.join(', ')}]${i==data.length-1?'':',\n'}`
			});
			paramsString+='\n]';
			setParams(paramsString)
		}).finally(()=>{
			setLoading(false);
		});
	}

	const copyText = () => {
		if (!isCopied && params!='') {
			navigator.clipboard.writeText(params);
			setIsCopied(true)
			displaySuccess('params copied!');
			setTimeout(() => {
				setIsCopied(false)
			}, 5000)
		}
	}

	useEffect(() => {
		if (account) {
			setAddress(account);	
		}
	}, [account])
	

	return (
		<PageLayout className={"text-center"}>
			{loading && <LoadingModal />}
			<div className="bg-purple-image bg-cover w-auto h-auto text-center pt-14 flex flex-col items-center text-white">
				<Banner title='MULTISIG' className='mt-20 md:mt-16'/>
				<p className='bg-gray-dark2 bg-opacity-70 px-10 py-5 whitespace-pre-line
				max-w-xs md:max-w-lg'>
					{`Write down the token IDs of the gen1 hatchies you want to stake separated by commas.
						Example: 12345, 6729, 2348
					`}
				</p>
				<div className='h-screen w-full flex flex-col items-center max-w-xs space-y-3 mt-5
				md:max-w-lg'>
					<div className=' w-full'>
						<span className='text-left font-bold text-xl flex'>Wallet Address</span>
						<Input value={address} onChange={setAddress} className='w-full' styleType='transparency' />
					</div>
					<div className='my-5 w-full'>
						<span className='text-left font-bold text-xl flex'>Token IDs</span>
						<TextArea value={tokensString} onChange={(e)=>setTokensString(e.target.value)} />
					</div>
					<Button label='Sign Tokens' color='green' className='mt-5' onClick={signTokenIDs}/>
					<div className=' w-full flex flex-col pt-10'>
						<span className='text-xl font-bold w-full text-left bg-gray-dark2 bg-opacity-70 p-2'>
							stakeContract.batchStake (params, referral);
						</span>
						<div>
							<span className='text-left font-bold text-xl flex'>Params</span>
							<TextArea disabled value={params} />
						</div>
						<Button label={isCopied?'Copied':'Copy'} color='green' className='mt-5'
							onClick={copyText}/>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}

export default MultisigPage

