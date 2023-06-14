import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import darkOptions from "../../constants/particles-presets/dark";
import fireOptions from "../../constants/particles-presets/fire";
import lightOptions from "../../constants/particles-presets/light";
import plantOptions from "../../constants/particles-presets/plant";
import voidOptions from "../../constants/particles-presets/void";
import waterOptions from "../../constants/particles-presets/water";
import { Element } from "../../types";

interface ParticlesProps {
  element: Element
}

export default function ElementParticles({element}:ParticlesProps) {
  const options = {
    Plant: plantOptions,
    Fire: fireOptions,
    Light: lightOptions,
    Dark: darkOptions,
    Void: voidOptions,
    Water: waterOptions,
  }
	const particlesInit = async (main:Engine) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };
	return (
		<Particles 
		id='tsparticles'
    init={particlesInit} 
		options={options[element]} 
		/>
	)
}
