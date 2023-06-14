import type { NextPage } from 'next'
import Router from 'next/router'
import Banner from '../components/Banner'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import PageLayout from '../components/PageLayout'

const FAQPage: NextPage = () => {
	return (
		<PageLayout className={"text-center"}>
			<div className="bg-dao bg-no-repeat bg-[#1F1F21] w-auto h-auto text-center 
			flex flex-col items-center pt-14">
				<div className='flex flex-col w-full justify-center items-center mt-20 md:mt-16'>

						<Banner title='FAQ' />
						<Dropdown title="What's an NFT?">
							<p>
								NFT stands for “non-fungible token” — a fancy way of saying it&apos;s a unique, one-of-a-kind digital item that users can buy, own, 
								and trade. Some NFTs&apos; main functions are to be digital art and to look cool; some offer additional utility, like exclusive access to websites 
								or participation in an event. Think of NFTs as rare pieces of art that can also act as a “member&apos;s card”.
							</p>
						</Dropdown>	
						<Dropdown title="What is Metamask?">
							<p>
								MetaMask is a browser plugin that serves as an Ethereum wallet, and is installed like any regular plugin. Once it&apos;s installed, it allows 
								users to store Ether and other ERC-20 tokens, enabling them to make transactions to any Ethereum address.<br/><br/>

								Web 3, the decentralized internet, is built on a foundation of cryptocurrencies and decentralized applications (dapps). But in order to use them, 
								you need a user-friendly interface.<br/><br/>
								
								MetaMask is one of the leading crypto wallets, and aims to be the gateway to the world of Web 3, decentralized finance (DeFi) and NFTs.
							</p>
						</Dropdown>
						<Dropdown title="How do I protect my metamask?">
							<p>
								8 simple tips for optimal MetaMask Security<br/><br/>
								1- Never give away your private keys — not to the MetaMask Support, not to an exchange, and not to Elon Musk who promises you 2 ether in return.<br/><br/>
								
								2- Always check the URL of the D&apos;app you&apos;re about to use and bookmark the correct URL.<br/><br/>
								
								3- Don&apos;t click on links from people you don&apos;t know. (A common scam in Discord: The hacker sends you a DM with a link that takes you to a deceptively
									real page… you connect your wallet… and have connected it for the last time.)<br/><br/>
								
								4- Don&apos;t keep large sums in MetaMask <br/><br/>
								
								5- Talk about crypto, not how much crypto you have. Otherwise, you&apos;ll easily make yourself a target.<br/><br/>
								
								6- Do not click on crypto ads of individual protocols. Why? Scammers place Google ads to get ahead of the real protocols in search results. 
								So maybe “uniiswap” is at the top when you search “uniswap”.<br/><br/>
								
								7- Never save your private keys on your computer or cell phone — always write them on a piece of paper.<br/><br/>
								
								8- Learn your private keys by heart…
							</p>
						</Dropdown>
						<Dropdown title="What is the asset library?">
							<p>
								An asset library is an online repository that helps brands store, source, manage, and share critical digital files. Asset libraries 
								are a great way to store any type of media. People use asset libraries to centralize photos, logos and color palettes, music files, video, text, 
								documents, templates, audio files, animations, and more. Brands use asset libraries to organize their most important digital IP (intellectual 
								property).<br/><br/>

								All assets in the digital asset library are easily accessible to the appropriate parties so brands can complete projects more quickly and to a higher 
								standard. A well-managed, centralized asset library is an essential part of a brand&apos;s digital strategy. Digital asset libraries are an integral part 
								of marketing and branding because they allow marketers to access their campaigns from anywhere in the world, with up-to-date information (metadata).
							</p>
						</Dropdown>
						<Dropdown title="What are the Hatchie Pocket NFT&apos;s?">
							<p>
								Hatchies are a collection of high fidelity elemental monster trading cards exclusively on Avalanche - with algorithmically increasing price 
								to mint and the total number of Hatchies capped at 40.000, making up 1025 sets. Those will be stakeable to earn currency that basically gives 
								you control of the brand itself.
							</p>
						</Dropdown>
						<Dropdown title="What&apos;s a DAO?">
							<p>
								A DAO, sometimes called a  DAC, is an organization represented by rules encoded as a computer program that is transparent, controlled 
								by the organization members and not influenced by a central government.
							</p>
						</Dropdown>
						<Dropdown title="What is Intellectual Property?">
							<p>
								Intellectual property (IP) refers to creations of the mind, such as inventions; literary and artistic works; designs; and symbols, 
								names and images used in commerce.<br/><br/>

								IP is protected in law by, for example, patents, copyright and trademarks, which enable people to earn recognition or financial benefit 
								from what they invent or create. By striking the right balance between the interests of innovators and the wider public interest, the IP system 
								aims to foster an environment in which creativity and innovation can flourish.
								</p>
						</Dropdown>
						<Dropdown title="Is this project community driven?">
							<p>
								Yes, we want the community involved as much as possible and this is the strongest way to show the power of decentralized IP.
							</p>
						</Dropdown>
						<Dropdown title="Why decentralize an IP?">
							<p>
								Intellectual Properties may be seeded by the artist or company, but they are usually grown in the hands, minds and experiences of 
								the community. Through their interaction and shared experiences the IP is truly established.<br/><br/>
								
								The more people that join the collective experience, the more value is usually generated in terms of culture and experience in the IP, similar 
								to the exponential value generation of a network effect.<br/><br/>

								We can see considerable value in decentralized ownership of an IP, especially through NFT means; as the Owners of the collection become the 
								owners of the brand and are empowered to help develop and benefit from the growth of the intellectual property, its ever expanding ecosystem, 
								and the value it generates.
							</p>
						</Dropdown>
						<Dropdown title="What is the main goal of the Hatchie Pockets?">
							<p>
								Our very long term goal and our big ambition is actually to take on giants of the industry and media industry like pokemon, digimon or yugioh. <br/><br/>

								Why or how we want to tackle it basically is by creating a repository of these assets so we plan to use them to make our own games but we&apos;re trying 
								to make something that everybody could use.
							</p>
						</Dropdown>
						<Dropdown title="What is the value proposition of the Hatchie Pocket?">
							Our big value proposition is that the community that&apos;s highly engaged the most engaged members of our community essentially get the highest 
							share of our brand essentially And anybody that wants to use our assets, our brand, our community, they get immediate access to those resources 
							with essentially 0 friction and we help them even in some cases such as to develop, their product but in most cases just having access to the assets 
							and having access to the community.
						</Dropdown>
						<Dropdown title="What is the utility of the Hatchy Pocket  NFT&apos;s?">
							<p>
								Fundamentally the utility is the staking And the utility for the tokens you get back is basically engagement in the ecosystem. <br/><br/>

								Going forward as a private entity using the freedom to create using the brand as a private entity, we&apos;ll be releasing a couple games. The first 
								ones that we can see what we believe to be a strong proof of concept. The first one we get is going to be just like a little mini game that just 
								shows you that you can connect and use your hatchie similar to using a toy in a different place and it&apos;s a kind of.<br/><br/>
								
								Potentially a client, so you&apos;ll be able to download it on your mobile phone and play a game. It&apos;s essentially outside of the tokenomics 
								structure. It is just the game where you can plug in your hatchie and get different features and then the ones that get a little bit deeper.<br/><br/>
								
								Our game road map will start with a little mini game. After that  the browser game and then one day eventually MMO.
							</p>
						</Dropdown>
						<Dropdown title="Are we able to use the NFT&apos;s for our generation one on these games too?">
							<p>
								Yeah you&apos;ll be able to use them both for staking both to manage the IP for other people and you&apos;ll basically be able to tell them 
								what they can and can&apos;t do with it.
							</p>
						</Dropdown>
						<Dropdown title="What is the difference between Crypto-Games, NFT Games, Blockchain Games?">
							<p>
								Crypto games are a type of video game that involves the technologies of blockchains and cryptocurrencies. Every in-game asset is 
								valued based on cryptocurrencies and it also functions as rewards and profits.<br/><br/>

								NFT games are gaming platforms where the in-game collectibles are represented as non-fungible tokens and these NFTs are traded over secondary 
								marketplaces for rewards in the form of cryptocurrencies or fiat cash.<br/><br/>
								
								Blockchain games are a type of video game that is built on a blockchain network and provides security and transparency to the platform.
							</p>
						</Dropdown>
						<Dropdown title="How do I get involved?">
							<p>
								A great place to start is our Discord, home to a very large and very active community of Digital Monsters enthusiasts. You don&apos;t 
								need to be a holder to join us there! All are welcome to jump into the conversation, let us know your ideas, and hang out with many others 
								who like the Monsters!
							</p><br/>
							<p>
								You can join our Discord here!
							</p>
							<a href='https://discord.gg/cW378HVjyY' target="_blank" rel="noreferrer">
								<p>
									https://discord.gg/cW378HVjyY
								</p>
							</a>
						</Dropdown>
						<Dropdown title="What is so special about this NFT collection?">
							<p>
								We encourage you to check out this medium post that lays out our grand vision.<br/><br/>
							</p>
							<a href='https://hatchypocket.medium.com/hatchy-pocket-grand-vision-b9496e85b4c3' target="_blank" rel="noreferrer">
								<p>
									https://hatchypocket.medium.com/hatchy-pocket-grand-vision-b9496e85b4c3
								</p>
							</a>
						</Dropdown>
						<Dropdown title="I have a multisig wallet. What can I do?">
							<p>
								Click on this button to go to multisig page.<br/>
							</p>
							<Button label='Multisig wallet' onClick={() => Router.push('/multisig')} className='my-2'/>
						</Dropdown>
						<div className='text-white my-10'>
							<h1>
							More questions?
							</h1>
							<p>
								Join our community on either Discord or Twitter and ask us anything there. 
							</p>
						</div>

				</div>
			</div>
		</PageLayout>
	)
}

export default FAQPage

