import Head from 'next/head'
import React from 'react'

export default function SEOHead() {
	return (
		<Head>
			<title>Hatchy Pocket</title>
			<link rel="icon" href="/favicon.ico" />

			<meta name="description" content="Hatchy pocket is a decentralized Intellectual Property(IP) owned and managed by a Decentralized Autonomous Organization(DAO). View collection and get some hatchies now!"/>

			{/* FACEBOOK META TAGS */}
			<meta property="og:url" content="https://hatchypocket.com/"/>
			<meta property="og:type" content="website"/>
			<meta property="og:title" content="Hatchy Pocket"/>
			<meta property="og:description" content="Hatchy pocket is a decentralized Intellectual Property(IP) owned and managed by a Decentralized Autonomous Organization(DAO). View collection and get some hatchies now!"/>
			<meta property="og:image" content="https://hatchypocket.com/hatchy_logo.png"/>

			{/* TWITTER META TAGS */}
			<meta name="twitter:card" content="summary_large_image"/>
			<meta property="twitter:domain" content="hatchypocket.com"/>
			<meta property="twitter:url" content="https://hatchypocket.com/"/>
			<meta name="twitter:title" content="Hatchy Pocket"/>
			<meta name="twitter:description" content="Hatchy pocket is a decentralized Intellectual Property(IP) owned and managed by a Decentralized Autonomous Organization(DAO). View collection and get some hatchies now!"/>
			<meta name="twitter:image" content="https://hatchypocket.com/hatchy_logo.png"/>

		</Head>
	)
}
