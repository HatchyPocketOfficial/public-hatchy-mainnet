import React from 'react'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import { useStake } from '../../contexts/StakeContext';
import { filter } from '../../utils/numberFormatterHelper';

interface WeightsTableProps {
}

export default function WeightsTable({
}:WeightsTableProps) {
	const {
		userWeight,
		referralBonus,
	} = useStake();

	const {
		gen2UserWeight
	} = useStakeGen2();

	return (
		<div className='my-5 w-full justify-center flex'>
			{/**Weights table */}
      <table className='hidden md:table bg-black bg-opacity-40 w-full max-w-2xl text-lg'>
        <tbody>
					<tr className='text-center'>
						<td className='py-1'>Gen 1 Weight</td>
						<td></td>
						<td>Gen 2 + $HATCHY &nbsp; Weight</td>
						<td></td>
						<td>Referral Bonus</td>
						<td></td>
						<td>Total Weight</td>
					</tr>
          <tr className='text-4xl font-bold'>
            <td className='py-2'>{filter(userWeight.toNumber())}</td>
						<td>+</td>
            <td>{filter(gen2UserWeight.toNumber())}</td>
						<td>+</td>
            <td className='text-green'>{filter(referralBonus)}</td>
						<td>=</td>
            <th >
							{filter(userWeight.toNumber()+gen2UserWeight.toNumber()+referralBonus)}
						</th>
          </tr>
        </tbody>
      </table> 
			{/**Weights table */}
      <table className='md:hidden bg-black bg-opacity-40 w-full max-w-xs text-lg'>
          <tbody>
              <tr >
                <td className='py-2 text-left pl-5'>Gen1 Weight</td>
                <td >{userWeight.toNumber()}</td>
              </tr>
              <tr>
                <td className='py-2 text-left pl-5'>Gen2 Weight</td>
                <td>{gen2UserWeight.toNumber()}</td>
              </tr>
              <tr>
                <td className='py-2 text-left pl-5'>Referral Bonus</td>
                <td className='text-green'>{referralBonus}</td>
              </tr>
              <tr className='border-t'>
                <th className='py-2 text-left pl-5'>Total</th>
                <th className='text-xl'>{userWeight.toNumber()+gen2UserWeight.toNumber()+referralBonus}</th>
              </tr>
          </tbody>
      </table> 
		</div>
	)
}
