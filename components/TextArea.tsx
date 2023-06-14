import React, { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
}
export default function TextArea({...defaultProps}:TextAreaProps) {
	return (
		<textarea className={`bg-transparent border border-white px-2 py-1 w-full h-40
		placeholder:text-white placeholder:opacity-60 ${defaultProps.className}`} 
		{...defaultProps}>
		</textarea>
	)
}
