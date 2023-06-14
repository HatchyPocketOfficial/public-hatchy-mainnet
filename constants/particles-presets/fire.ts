import type { ISourceOptions } from "tsparticles-engine";

const fireOptions: ISourceOptions = {
	fullScreen: {
		enable: true,
		zIndex: 30
	},
	particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                area: 800,
            },
        },
        color: {
            value: ["#fdcf58", "#757676", "#f27d0c", "#800909", "#f07f13"],
        },
        shape: {
            type: "square",
        },
        opacity: {
            value: { min: 0.5, max: 0.8 },
        },
        size: {
            value: { min: 2, max: 4 },
        },
        move: {
            enable: true,
            speed: 4,
            random: false,
        },
    },
	retina_detect: true,
	background: {
		position: "50% 50%",
		repeat: "no-repeat",
		size: "cover",
		
	}
}

export default fireOptions