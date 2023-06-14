import type { NextPage } from 'next'
import Image from 'next/image'
import PageLayout from '../components/PageLayout'
import Button from '../components/Button'
import { useState } from 'react'

const GamesPage: NextPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = [
    {
      src: '/static/survivors/collect.jpg',
      alt: 'Collect',
    },
    {
      src: '/static/survivors/explore.jpg',
      alt: 'Explore',
    },
    {
      src: '/static/survivors/bosses.jpg',
      alt: 'Bosses',
    },
    {
      src: '/static/survivors/prizes.jpg',
      alt: 'Prizes',
    },
    {
      src: '/static/survivors/combos.jpg',
      alt: 'Combos',
    },
    {
      src: '/static/survivors/upgrades.jpg',
      alt: 'Upgrades',
    },
  ];

  return (
    <PageLayout className=''>
        <section className='bg-blue bg-cover flex flex-col items-center mt-10 md:pt-28 pt-20 pb-10'>
          <div className='flex flex-col w-full max-w-4xl'>
            <h1 className='font-quicksilver text-center font-medium drop-shadow-blue mb-5 text-4xl mt-10
            md:text-5xl md:mt-0 text-white'>
              Hatchy World Survivors
            </h1>
            <p className='mt-3 text-white px-5 text-center text-base drop-shadow-blue
            md:text-lg'>
              Battle hordes & survive treacherous environments in Hatchy survivors roguelite
            </p>
            <div className='flex flex-col items-center bg-blue-panel bg-cover p-5 text-xl border-4 rounded-3xl m-6 space-y-3
            md:m-5'>
              <div className='w-64 h-40 sm:w-96 sm:h-56 relative flex items-center rounded-md overflow-hidden mb-4 border-4 drop-shadow-blue
              lg:w-[35rem] lg:h-[20rem] '>
                <Image src={images[selectedImage].src} alt={images[selectedImage].alt} layout='fill' objectFit='cover'/>
              </div>
              <div className='flex flex-row space-x-1 sm:space-x-5 w-60 overflow-x-auto
              sm:w-[32rem] lg:w-[40rem]'>
                {images.map((image, index) => (
                  <div key={image.src} className='min-w-[4rem] h-12 sm:min-w-[9rem] sm:h-20 lg:w-40 lg:h-28
                  relative flex items-center rounded-md overflow-hidden border'>
                    <Image src={image.src} alt={image.alt} layout='fill' objectFit='cover' onClick={() => setSelectedImage(index)}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col-reverse items-center w-full max-w-4xl'>
            <div className='flex flex-col w-full text-white font-bold
            lg:m-5'>
              <div className='flex flex-col bg-blue-panel bg-cover p-5 mb-5 border-4 rounded-3xl mx-6
              sm:p-10'>
                <h1 className='pb-3 border-b-4'>
                  Description
                </h1>
                <p className='pt-3 h-60 overflow-y-auto font-medium '>
                  Hatchy World: Survivors is an epic arcade style game with fast paced combat and 
                  rogue-lite elements.
                  <br/><br/>
                  Your skills will be tested as you battle through hordes of elemental monsters, 
                  navigate treacherous environments, and face-off against powerful bosses.
                  <br/><br/>
                  Can you survive in this dangerous world long enough to become the ultimate summoner 
                  and conquer the challenges that lie ahead?
                  <br/><br/>
                  Rogue-lite elements mean each playthrough is different and meaningful. 
                  You can use the gold you collect during each run to purchase helpful upgrades to 
                  aid you in your next quest to survive the Hatchy World!
                  <br/><br/>
                  Tournament Events allow you to compete globally for exclusive blockchain backed 
                  collectibles that can be used across upcoming Hatchyverse products!
                </p>
              </div>
              <div className='flex justify-center w-full font-medium text-xl'>
                <a href='https://hatchypocket-game-files.s3.amazonaws.com/survivors/HatchyWorldSurvivors.apk'
                  rel='noreferrer'
                  download='HatchyWorldSurvivors.apk'
                  className='bg-black rounded-lg flex flew-row
                  justify-center items-center w-auto px-3 pr-5 py-1
                  drop-shadow-blue'
                >
                  <span className='w-16'> 
                    <Image
                      src={"/static/survivors/android-logo.png"}
                      alt='download now' width={100} height={100} objectFit='contain'
                    />
                  </span>
                  <div className='flex flex-col justify-center items-center'>
                    <span className='w-full text-sm'>
                      DOWNLOAD FOR
                    </span>
                    <span className='font-black'>ANDROID
                    </span>
                  </div> 
                </a>
              </div>
            </div>
          </div>
        </section>
        {/*
        <section className='bg-ecosystem bg-cover flex flex-col items-center pt-10 h-screen'>
            <div className='md:w-96 md:h-64 w-72 h-48 relative mt-20'>
              <Image src={"/hatchy_world.png"} alt='hatchy pockets world logo' layout='fill' className='object-contain' />
            </div>
            <div className='md:w-96 md:h-20 w-72 h-14 relative mb-7'>
              <Image src={"/play_earn.png"} alt='play and earn' layout='fill' className='object-contain' />
          </div>
          <span className='font-black text-yellow text-4xl bg-black bg-opacity-40 px-5 py-2'>Coming Soon</span>
          <div className="flex items-center justify-center max-w-2xl w-full p-10 ">
            <iframe className='w-full aspect-video' src="https://www.youtube.com/embed/LmicCRmVhwA" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </section>
        <section className='bg-dark3 flex flex-col items-center py-10'>  
          <div className='flex flex-row'>
            <div className='text-yellow md:p-10 ml-5 mt-5 mb-5 mr-2 '>
              <p className='text-2xl font-black'>
                Accessible for everyone!
              </p>
              <p className=''>
                You can play without owning any hatchies, but having a hatchy will give you sweet bonuses. Regardless, be prepared to party up with your friends!
              </p>
            </div>
            <div className='text-yellow md:p-10 m-5'>
              <p className='text-2xl font-black'>
                CROSS PLATFORM
              </p>
              <p>
                More ways to play!
              </p>
            </div>
          </div>
        </section>
        <section className='bg-ecosystem2 bg-cover flex flex-col items-center py-10'>
          <div className='flex flex-col items-center max-w-6xl bg-black bg-opacity-60 text-yellow m-6 md:p-10 p-5 md:w-3/5 w-4/5'>
              <p className='text-xl font-black'>
                Summon Pets, 
              </p>
              <p>
                Designate a hatchy to be your partner in battle, and explore the open world of Hatchy.
              </p>
          </div>
          <div className='flex flex-col items-center max-w-6xl bg-black bg-opacity-60 text-yellow m-6 md:p-10 p-5 md:w-3/5 w-4/5'>
              <p className='text-xl font-black'>
                Unique Team synergies 
              </p>
              <p>
                Hundreds of team synergies based on your team build!
              </p>
          </div>
        </section>
        <section className='bg-dark3 flex flex-col items-center'>
          <div className='flex flex-col text-yellow md:p-10 p-5 max-w-6xl m-6 md:w-3/5 w-4/5'>
              <p className='text-2xl font-black'>
                Find Cards
              </p>
              <p className='mb-14'>
                Find Common and ephemeral cards
              </p>
              <p>
                (introducing ephemeral cards, ingame non NFT)
              </p>
          </div>
        </section>
        <section className='bg-ecosystem3 bg-cover flex flex-col items-center'>
          <div className='max-w-6xl bg-black bg-opacity-60 text-yellow m-6 md:p-10 p-5 md:w-3/5 w-4/5'>
            <p className='font-black'>
              Build your hero your way
            </p>
            <p className='mb-8'>
              Your hatchies and equipment dictate the players skills, stats and build.
            </p>
            <p>
              Billions of unique build combinations with skill tree spread across the entire Hatchy collection!
            </p>
          </div>
          <div className='max-w-6xl bg-black bg-opacity-60 text-yellow m-6 md:p-10 p-5 md:w-3/5 w-4/5'>
            <p className='text- font-black'>
              Rebirth for unlimited cards and power!
            </p>
            <p className='mb-16'>
              You can level to 99 and then rebirth, you get a ephemeral card you get 5 extra stats and each stat is worth more. 
            </p>
            <p className='font-black'>
              Level & Rebirth Hatchies
            </p>
            <p>
              when you rebirth a monster, it gives ephemeral of itself!
            </p>
            <p>
              when you rebirth your player, you receive a random ephemeral card!
            </p>
          </div>
        </section>
        <section className='bg-dark3 flex flex-col items-center'>
          <div className='flex flex-col text-yellow md:p-10 p-5 max-w-6xl m-6 md:w-3/5 w-4/5  '>
            <p className='text-2xl font-black'>
              Burn cards
            </p>
            <p>
              Sink duplicates of a monster to increase its gained exp in the game!
              Shiny		+ 1000% EXP  -  Common	+ 100% EXP  -  Ephemeral	+ 10% EXP stack cards and rebirth unlimited times.
            </p>
            <p className='text-white text-sm'>
              Ephemeral cards are destroyed when burned - Hatchy cards are kept in game vault for future plans
            </p>
          </div>
          <div className='flex flex-col text-yellow md:p-10 p-5 max-w-6xl m-6 md:w-3/5 w-4/5'>

            <p className='text-right text-2xl font-black'>
              Ecosystem proving!
            </p>
            <p className='text-right'>
              Game adheres to hatchy licensing rules of 10% developer tax.
            </p>
          </div>
        </section>
        <section className='bg-ecosystem4 bg-cover h-96'>

        </section>
        */}
        
    </PageLayout>
  )
}

export default GamesPage

