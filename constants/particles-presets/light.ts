import type { ISourceOptions } from "tsparticles-engine";

const lightOptions: ISourceOptions = {
	fullScreen: {
		enable: true,
		zIndex: 30
	},
	particles: {
        move: {
            enable: true,
            random: true,
            straight: true,
        },
        opacity: {
            value: { min: 0.1, max: 0.5 },
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
	background: {
		position: "50% 50%",
		repeat: "no-repeat",
		size: "cover"
	}
}

export default lightOptions