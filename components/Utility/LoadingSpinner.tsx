import { Icon } from '@iconify/react';
import React from 'react';

interface LoadingSpinnerProps {
	width?: number
	className?: string
}
export default function LoadingSpinner({ width, className }: LoadingSpinnerProps) {
	return (
		<div>
			<Icon icon="uiw:loading" className={`animate-spin ${className}`} width={width || 100} />
		</div>
	);
}
