import type { ISourceOptions } from "tsparticles-engine";

const darkOptions: ISourceOptions = {
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
            value: ["#240046", "#3c096c", "#7b2cbf", "#c77dff", "#e0aaff"],
        },
        shape: {
            type: "square",
        },
        opacity: {
            value: { min: 0.5, max: 0.8 },
        },
        size: {
            value: { min: 2, max: 5 },
        },
        move: {
            enable: true,
            speed: 2,
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

export default darkOptions