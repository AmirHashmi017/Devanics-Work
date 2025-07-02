import { useState, useRef, useEffect } from "react";

function useToggleVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return {
    isVisible,
    toggleVisibility,
    containerRef,
  };
}

export default useToggleVisibility;
