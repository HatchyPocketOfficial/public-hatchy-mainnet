import Image from 'next/image';
import React, {useEffect, useState} from 'react';

const ButtonScrollTop = () =>{
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (window.pageYOffset > 300){
      setShowScroll(true)
    } else if (window.pageYOffset <= 300){
      setShowScroll(false)
    }
  };

  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

	useEffect( () => {
  		window.addEventListener('scroll', checkScrollTop)
    	return () => {
			// unmount
  		 	window.removeEventListener('scroll', checkScrollTop)
    	}
	}, [] );

	return (
		<button onClick={scrollTop} className={`w-10 h-10 fixed bottom-5 right-5 z-40 transition-opacity duration-300
		${showScroll?'opacity-100':'opacity-0'} `}>
				<Image src={'/static/misc/button_tothemoon.png'} alt='Scroll to top' layout='fill'/>
		</button>
	);
}

export default ButtonScrollTop;
