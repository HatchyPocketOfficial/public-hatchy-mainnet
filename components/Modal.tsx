import React, { ReactNode, useEffect, useState } from 'react'

export interface ModalProps {
	closeModal: () => void
	isOpen: boolean
	className?: string
	children?: ReactNode
}

export default function Modal({ closeModal, isOpen, className, children }: ModalProps) {
	const [showModal, setShowModal] = useState(false)
	const ref = React.useRef<HTMLDivElement>(null);
	useEffect(() => {
		const checkIfClickedOutside = (e: any) => {
			if (ref.current == e.target && isOpen) {
				setShowModal(false);
				closeModal()
			}
		}
		const checkIfKeyPress = (e: any) => {
			if (e.key == "Escape" && isOpen) {
				setShowModal(false);
				closeModal()
			}
		}
		document.addEventListener('keydown', checkIfKeyPress);
		document.addEventListener("click", checkIfClickedOutside)
		return () => {
			document.removeEventListener("click", checkIfClickedOutside)
			document.removeEventListener("keydown", checkIfKeyPress)
		}
	}, [isOpen])

	return ( //
		<div className={`${(!isOpen && !showModal) && 'hidden'} w-full h-screen z-20 bg-white bg-opacity-50 fixed top-0 left-0 flex justify-center items-center`} ref={ref} >
			<div className={`p-5 pt-2 max-h-3xl overflow-y- shadow-xl ${className ? className : 'w-10/12 max-w-3xl'}`}>
				{children}
			</div>
		</ div >
	)
}
