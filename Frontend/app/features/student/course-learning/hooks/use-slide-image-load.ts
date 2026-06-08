import { useEffect, useState } from "react";

export function useSlideImageLoad(imageUrl: string, resetKey?: string | number) {
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);
  const [isSlideLoading, setIsSlideLoading] = useState(true);

  useEffect(() => {
    setDisplayedImageUrl(null);
    setIsSlideLoading(true);
  }, [resetKey]);

  useEffect(() => {
    if (!imageUrl) {
      setIsSlideLoading(false);
      return;
    }

    setIsSlideLoading(true);

    const preloadImage = new Image();
    preloadImage.src = imageUrl;

    function markLoaded() {
      setDisplayedImageUrl(imageUrl);
      setIsSlideLoading(false);
    }

    if (preloadImage.complete && preloadImage.naturalWidth > 0) {
      markLoaded();
      return;
    }

    preloadImage.addEventListener("load", markLoaded);
    preloadImage.addEventListener("error", markLoaded);

    return () => {
      preloadImage.removeEventListener("load", markLoaded);
      preloadImage.removeEventListener("error", markLoaded);
    };
  }, [imageUrl]);

  return {
    displayedImageUrl,
    isSlideLoading,
    handleSlideImageLoad: () => {
      setDisplayedImageUrl(imageUrl);
      setIsSlideLoading(false);
    },
    handleSlideImageError: () => {
      setDisplayedImageUrl(imageUrl);
      setIsSlideLoading(false);
    },
  };
}
