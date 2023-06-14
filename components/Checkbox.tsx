import { Icon } from '@iconify/react'

interface CheckboxProps {
	allSelected?: boolean
	onClick: () => void
	color?: 'default' | 'shiny'
}

export default function Checkbox({ allSelected, onClick, color = 'default' }: CheckboxProps) {
	if (color === 'shiny') {
		return (
			<button className='w-5 h-5 bg-yellow flex justify-center items-center' onClick={onClick}>
				<div className='w-4 h-4 bg-blue-400 ' >
					{allSelected &&
						<Icon icon="ci:check-bold" className='text-yellow' />
					}
				</div>
			</button>

		)
	}
	else {
		return (
			<button className='w-5 h-5 bg-white flex justify-center items-center' onClick={onClick}>
				{allSelected &&
					<div className='w-4 h-4 bg-green-dark ' >
						<Icon icon="ci:check-bold" />
					</div>
				}
			</button>
		)
	}
}
