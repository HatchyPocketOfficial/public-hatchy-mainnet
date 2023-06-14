import React, { SelectHTMLAttributes } from 'react'

interface ButtonFilterProps extends SelectHTMLAttributes<HTMLSelectElement> {
	/** Display options*/
	options: string[];
	values?: string[];
}

export default function Select({ options, values, className, ...defaultProps }: ButtonFilterProps) {

	return (
		<select value={defaultProps.value} className={`block w-full px-2 py-1.5 text-white
      bg-black bg-clip-padding bg-no-repeat bg-opacity-40
      border border-solid border-white
      transition
      ease-in-out
      m-0
       focus:border-blue-600 focus:outline-none ${className}`} {...defaultProps}>
			{values ?
				options.map((opt, i) => {
					return (
						<option value={values[i]} key={opt} >{opt}</option>
					)
				})
				:
				options.map((opt, i) => {
					return (
						<option value={opt} key={opt} >{opt}</option>
					)
				})
			}
		</select>
	)
}
