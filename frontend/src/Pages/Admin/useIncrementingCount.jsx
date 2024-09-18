import { useState, useEffect } from "react";

const useIncrementingCount = (targetCount, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = targetCount / (duration / 10);
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        setCount(targetCount);
        clearInterval(interval);
      } else {
        setCount(Math.round(start));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [targetCount, duration]);

  return count;
};

export default useIncrementingCount; 