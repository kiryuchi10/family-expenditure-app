import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ items, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  if (!items || items.length === 0) {
    return <div className="carousel-empty">No items to display</div>;
  }

  return (
    <div className="carousel">
      <div className="carousel-container">
        <button 
          className="carousel-button carousel-button-prev"
          onClick={goToPrevious}
          disabled={items.length <= 1}
        >
          &#8249;
        </button>

        <div className="carousel-content">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={index} className="carousel-slide">
                {item}
              </div>
            ))}
          </div>
        </div>

        <button 
          className="carousel-button carousel-button-next"
          onClick={goToNext}
          disabled={items.length <= 1}
        >
          &#8250;
        </button>
      </div>

      {items.length > 1 && (
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${
                index === currentIndex ? 'carousel-indicator-active' : ''
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;