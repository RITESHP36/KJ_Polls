import React, { useEffect } from "react";
import "./form.css";

const FormPage = () => {
  useEffect(() => {
    const containers = document.querySelectorAll(".container");
    containers.forEach((container) => {
      const textCopies = container.querySelectorAll(".text-copy");
      let index = 0;

      function animateText() {
        textCopies.forEach((textCopy, i) => {
          if (i === index % textCopies.length) {
            textCopy.style.strokeDashoffset = "0%";
            textCopy.style.animationDelay = `-${i}s`;
          } else {
            textCopy.style.strokeDashoffset = "-35%";
            textCopy.style.animationDelay = null;
          }
        });
        index++;
      }

      animateText();
      setInterval(animateText, 5000); // Change text every 5 seconds
    });
  }, []);

  return (
    <div className="bg-white">
      <div className="container">
        <svg viewBox="0 0 960 300">
          <symbol id="s-text">
            <text textAnchor="middle" x="50%" y="80%">Montserrat</text>
          </symbol>
          <g className="g-ants">
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
            <use xlinkHref="#s-text" className="text-copy"></use>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FormPage;
