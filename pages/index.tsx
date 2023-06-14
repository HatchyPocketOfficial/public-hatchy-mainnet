import { useWeb3React } from '@web3-react/core';
import type { NextPage } from 'next'
import HomePage from "./home";

const Home: NextPage = () => {
	const { account  } = useWeb3React();
	//const triedToEagerConnect = useEagerConnect();
	return (
		<HomePage />
	)
}

export default Home
