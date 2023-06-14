import { useWallet } from "../../contexts/WalletContext";
import Button from "../Button";
import Input from "../Input";

interface HatchySearchBarProps {
  gen: number
  value: string
  onChange: (value: string) => void
}

export default function HatchySearchBar({ gen, value, onChange }: HatchySearchBarProps) {
  return (
    <div className="w-full text-white flex flex-row
    justify-center items-center">
      <Input placeholder={`Search Gen ${gen} Hatchy`} className="w-72 h-10"
      value={value} onChange={onChange}/> 
    </div>
  )
}