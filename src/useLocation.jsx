import { useState, useEffect } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // 위치 정보를 가져오는 함수
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported.');
      }
    };

    getLocation();
  }, []);

  return location;
}

export default useLocation;
