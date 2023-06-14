import type { ISourceOptions } from "tsparticles-engine";

const voidOptions: ISourceOptions = {
	fullScreen: {
		enable: true,
		zIndex: 30
	},
	particles: {
		number: {
			value: 80,
		},
		color: {
			value: "#319B19"
		},
		shape: {
			type: "image",
			options: {
				image: [
					{
						src: 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/5c21cae7b275944.png',
					},
					{
						src: 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/147eccb685ce856.png',
					}	
				]
			}
		},
		opacity: {
			value: 1,
		},
		size: {
			value: 20,
			random: true,
			anim: {
			 	enable: false,
			 	speed: 40,
			 	size_min: 10,
			 	sync: false
			}
		},
		rotate: {
			random: {
				enable: true,
				minimumValue: 1
			},
			animation: {
				enable: true,
				speed: 5,
			},
			direction: "random"
		},
		move: {
			enable: true,
			speed: 2,
			direction: "bottom",
			//vibrate: true,
			random: false,
			straight: false,
			out_mode: "out",
			gravity: {
				acceleration: 9.81
			},
		}
	},
	retina_detect: true,
	background: {
		position: "50% 50%",
		repeat: "no-repeat",
		size: "cover"
	}
}

export default voidOptions