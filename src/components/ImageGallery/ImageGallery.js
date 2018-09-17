import React from 'react';
import ImageGallery from 'react-image-gallery';
import './ImageGallery.css';

const CountyImageGallery = ({ images }) => (
  <div className="image-gallery-image">
    <ImageGallery
      items={images}
      showFullscreenButton={false}
      showPlayButton={false}
      showNav={false}
    />
  </div>
);

export default CountyImageGallery;
