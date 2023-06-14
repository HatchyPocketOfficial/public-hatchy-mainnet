import React from 'react'

interface TitleProps{
	title:string
}
export default function DAOTitle({title}:TitleProps) {
    return (
        <div>
            <span className='font-government text-xl text-gray-dark bg-yellow flex m-auto
            justify-center items-center h-10 w-80'>{title}</span>
        </div>
    )
}
