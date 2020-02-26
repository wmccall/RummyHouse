import { useRef, useEffect } from 'react';

export const getTimeAgo = secs => {
  const nowSeconds = Date.now() / 1000;
  const secondsDifference = nowSeconds - secs;
  const minutes = Math.floor(secondsDifference / 60);
  const hours = Math.floor(secondsDifference / 60 / 60);
  const days = Math.floor(secondsDifference / 60 / 60 / 24);
  const weeks = Math.floor(secondsDifference / 60 / 60 / 24 / 7);
  const months = Math.floor(secondsDifference / 60 / 60 / 24 / 30);
  const years = Math.floor(secondsDifference / 60 / 60 / 24 / 365);
  if (minutes <= 0) {
    return 'just now';
  }
  if (hours === 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (days === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (weeks === 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (months === 0) {
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  if (years === 0) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

export const stringToNum = str => {
  const stringSplit = str.split('');
  let num = 0;
  stringSplit.forEach(char => {
    num += char.charCodeAt(0);
  });
  return num;
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
