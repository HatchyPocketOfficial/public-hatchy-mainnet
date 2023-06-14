import { BigNumber, ethers } from "ethers";
import Button from "../Button";
import Input from "../Input";
import React, {useState } from 'react'
import { getHatchyPocketEggsGen2Address, getPockyAddress } from "../../utils/addressHelpers";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { getTokenContract } from "../../utils/contracts";
import LoadingModal from "../LoadingModal";

export default function HatchyApproveForm() {
  const {account, provider} = useWeb3React();
  const [amount, setAmount] = useState<string | BigNumber>('2000');
  const [loading, setLoading] = useState(false);
  const handleApprove = async () => {
    if (account && provider) {
      try {
        setLoading(true);
        const tokenContract = getTokenContract(getPockyAddress(), provider.getSigner());
        if (BigNumber.isBigNumber(amount)) {
          const tx = await tokenContract.approve(getHatchyPocketEggsGen2Address(), amount);
          await tx.wait(1);
        } else {
          const auxAmount = ethers.utils.parseUnits(amount, 18);
          const tx = await tokenContract.approve(getHatchyPocketEggsGen2Address(), auxAmount);
          await tx.wait(1);
        }
        toast.success('Approved');
      } catch (error) {
        console.log(error);
        toast.error('Transaction Error');
      } finally {
        setLoading(false);
      }
    }
  }
  return (
		<div className='py-2 flex flex-col items-center w-60'>
      {loading &&
        <LoadingModal />
      }
      <span className="text-sm">Update $HATCHY approved amount to spend by Gen2 Eggs contract</span>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center">
          <Input
            className='w-full h-10'
            placeholder='Enter approval amount'
            value={amount.toString()}
            onChange={setAmount}
          />
          <span className="underline pl-2 cursor-pointer"
            onClick={()=>setAmount(ethers.constants.MaxUint256)}>
            MAX.
          </span>
        </div>
        <Button
          label='Approve'
          className='w-full mt-2'
          onClick={handleApprove}
        />
      </div>
		</div>
  )
}