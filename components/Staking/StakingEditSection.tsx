import React, { useEffect, useState } from 'react'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import { useStake } from '../../contexts/StakeContext';
import { useStakeTokens } from '../../contexts/StakeTokensContext';
import { useWallet } from '../../contexts/WalletContext';
import { HatchyStatsObject } from '../../types';
import { getHatchieFilteredCount } from '../../utils/metadataArraysUtils';
import Button from '../Button';
import GenSelector from '../Utility/GenSelector';
import CollectionGridWallet from '../Wallet/CollectionGridWallet';

interface StakingEditSectionProps {
    setShowEditDetail: (value: string) => void
}

export default function StakingEditSection({
    setShowEditDetail,
}: StakingEditSectionProps) {
    /*Navigation Menu */
    const [showShinyOnly, setShowShinyOnly] = useState(false);
    /* Wallet */
    const {
        metadatas,
        gen,
        gen2Metadatas,
    } = useWallet();
    /*Staking */
    const {
        hadaapproved,
        stakedMetadatas,
    } = useStake();
    const {
        hadaapprovedGen2,
        gen2StakedMetadatas,
    } = useStakeGen2();

    const {
        handleStakeAndUnstake,
        stakeTokens,
        unstakeTokens,
        cancelAll,
        addStakeTokens,
    } = useStakeTokens();

    const [filteredHatchies, setFilteredHatchies] = useState<HatchyStatsObject>();
    const [totalCount, setTotalCount] = useState(0);
    const [totalShiny, setTotalShiny] = useState(0);

    /*Filter Management*/
    useEffect(() => {
        let filteredMetadatasAux = getHatchieFilteredCount(
            showShinyOnly,
            gen,
            gen == 1 ? metadatas : gen2Metadatas,
            gen == 1 ? stakedMetadatas : gen2StakedMetadatas,
        );
        // let allCount = 0;
        let shinyCount = 0;
        for (const key in filteredMetadatasAux) {
            const stats = filteredMetadatasAux[key];
            // allCount +=stats.count;
            shinyCount += stats.shinyCount;
        }
        setTotalShiny(shinyCount);
        setFilteredHatchies(filteredMetadatasAux);
        if (gen == 1 && metadatas && stakedMetadatas) {
            setTotalCount(metadatas.length + stakedMetadatas.length);
        }
        if (gen == 2 && gen2Metadatas && gen2StakedMetadatas) {
            setTotalCount(gen2Metadatas.length + gen2StakedMetadatas.length);
        }
    }, [showShinyOnly, metadatas, gen2Metadatas, stakedMetadatas, gen]);


    return (
        <section className='flex flex-col justify-center items-center text-white pt-10 max-w-6xl space-y-5
		md:px-5'>
            <div className='flex flex-col w-full justify-center items-center'>
                <div className='flex flex-row w-full max-w-sm my-3 justify-between px-2'>
                    <Button label={`ALL`} color='black' className='w-40 px-0'
                        selected={!showShinyOnly} onClick={() => setShowShinyOnly(false)} />
                    <Button label={`SHINY`} color='black' className='w-40 px-0'
                        selected={showShinyOnly} onClick={() => setShowShinyOnly(true)} />
                </div>
                {/*Navigation menu 
                    <CollectionGridStake setShowEditDetail={setShowEditDetail} filter={showShinyOnly} ownedHatchies={filteredHatchies}/>
                */}
                <GenSelector />
                <CollectionGridWallet
                    stakingView
                    setSelectedHatchyID={() => { }}
                    selectedMonsterID={0}
                    ownedHatchies={filteredHatchies}
                    setShowEditDetail={setShowEditDetail}
                />
                <div className='flex flex-col w-full max-w-xs space-y-3 justify-between pb-5
                md:space-y-0 md:justify-between md:flex-row md:max-w-xl'>
                    {(unstakeTokens.length > 0 || stakeTokens.length > 0) &&
                        <Button label={`Cancel`} color='red' onClick={cancelAll} className='md:self-end' />
                    }
                </div>
            </div>
        </section>
    )
}
