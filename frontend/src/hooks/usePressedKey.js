import { useEffect, useState } from 'react';

export const usePressedKey = (keys) => {
  const [pressedKey, setPressedKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keys.includes(event.key)) {
        setPressedKey(event.key);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  return pressedKey;
};
