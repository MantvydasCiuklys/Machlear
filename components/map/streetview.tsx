import React from 'react';

interface StreetViewProps {
  latitude: number;
  longitude: number;
}

const StreetView: React.FC<StreetViewProps> = ({ latitude, longitude }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getImageUrl = () => {
    // Define parameters such as size, location, heading, pitch, and your API key
    const size = '600x300'; // Example size, adjust as needed
    const heading = 165; // Example heading, adjust as needed
    const pitch = 0; // Example pitch, adjust as needed
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${latitude},${longitude}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = getImageUrl();
    link.download = 'street-view-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='map'>
        <img src={getImageUrl()} alt="Street View" style={{ width: '100%', height:"100%"}} />
    </div>
  );
};

export default StreetView;
