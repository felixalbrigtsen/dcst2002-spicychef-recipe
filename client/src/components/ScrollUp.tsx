import * as React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes 
} from 'react-router-dom';

import { useState } from 'react';

import { FaArrowCircleUp } from 'react-icons/fa';

function ScrollButton() {
    const [visible, setVisible] = useState(false)
    
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 50){
        setVisible(true)
      } 
      else if (scrolled <= 300){
        setVisible(false)
      }
    };
    
    const scrollToTop = () =>{
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
        /* you can also use 'auto' behaviour
           in place of 'smooth' */
      });
    };
  
    window.addEventListener('scroll', toggleVisible);
    
    return (
      <button name='/scroll/up' style={{display: visible ? "inline" : "none"}}>
       <FaArrowCircleUp 
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '.5rem',
          fontSize: '2rem',
          zIndex: 1,
          display: visible ? 'inline' : 'none'
        }} />
      </button>
    );
  }

export default ScrollButton;