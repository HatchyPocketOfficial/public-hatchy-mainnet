import React from 'react';
import PageLayout from '../components/PageLayout';
import { NextPage } from 'next';
import ClaimGen2Section from '../components/Home/claimGen2Section';
import ClaimGen1Section from '../components/Home/claimGen1Section';

const ClaimPage: NextPage = () => {
	return (
		<PageLayout >
			<ClaimGen1Section />
			<ClaimGen2Section />
		</PageLayout>
	)
}

export default ClaimPage;