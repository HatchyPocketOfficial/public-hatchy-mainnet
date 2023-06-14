import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
	value: string | number
	/**callback for on change event, usualy a setState function */
	onChange?: (value:any )=>void
	/** callback to execute on 'Enter' keydown */
	onEnterKeyDown?: Function
	styleType?: string
	className?: string
}

export default function Input({value, styleType='default', onChange=(e:string )=>{}, onEnterKeyDown, className, ...defaultProps}:InputProps) {
	const styleClasses:any = {
		'default':`appearance-none bg-white text-gray-dark2 text-center ring-0 ring-transparent overflow-hidden px-1 
					focus:outline-none focus:border-gray-dark  border-2 ${className?className:'w-20 h-10'} `,
		'minimalist': `appearance-none bg-transparent text-center ring-0 ring-transparent overflow-hidden px-1 
						focus:outline-none focus:border-b-white border-b-2 w-full ${className} `,
		'transparency': `appearance-none bg-white  text-center ring-0 ring-transparent overflow-hidden px-1 
					focus:outline-none focus:border-gray-dark bg-opacity-25 border-0 text-white placeholder:text-gray-200 ${className}`,
	}

	const executeOnEnter = (event: React.KeyboardEvent) => {
		if (onEnterKeyDown && event.key === 'Enter') {
			onEnterKeyDown();
		}
	}
	return (
		<input value={value} onChange={(e)=>onChange(e.target.value)} 
		onKeyDown={executeOnEnter}
		{...defaultProps}
			className={styleClasses[styleType]}>
		</input>
	)
}