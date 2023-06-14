import { MoveDirection, OutMode } from "tsparticles-engine";
import type { ISourceOptions } from "tsparticles-engine";

const waterOptions: ISourceOptions = {
	fullScreen: {
		enable: true,
		zIndex: 30
	},
	particles: {
        number: {
            value: 28,
        },
        color: {
            value: ['#0077b6', '#00b4d8', '#90e0ef'],
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: 0.7,
        },
        size: {
            value: { min: 3, max: 6 },
        },
        move: {
            angle: {
                offset: 0,
                value: 30,
            },
            enable: true,
            speed: 10,
            direction: "top",
            random: false,
            straight: false,
            outModes: {
                default: "out",
            },
        },
    },
	retina_detect: true,
	background: {
		position: "50% 50%",
		repeat: "no-repeat",
		size: "cover"
	}
}

export default waterOptions