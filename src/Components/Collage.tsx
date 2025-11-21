import { useState, useEffect, useRef } from "react";

interface CollageProps {
  images: {
    imageData: string;
  }[];
}

function Collage({ images }: CollageProps) {
  const imageSources = images.map(
    (image) => `data:image/jpeg;base64,${image.imageData}`,
  );

  const visibleCount = 3;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateStartIndex = (newSelected: number) => {
    let newStart = newSelected - Math.floor(visibleCount / 2);

    if (newStart < 0) newStart = 0;
    if (newStart + visibleCount > imageSources.length)
      newStart = Math.max(0, imageSources.length - visibleCount);

    setStartIndex(newStart);
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      const newSelected = selectedIndex - 1;
      setSelectedIndex(newSelected);
      updateStartIndex(newSelected);
    }
  };

  const handleNext = () => {
    if (selectedIndex < imageSources.length - 1) {
      const newSelected = selectedIndex + 1;
      setSelectedIndex(newSelected);
      updateStartIndex(newSelected);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const thumbnailWidth = containerRef.current.children[0]?.clientWidth || 0;
      const gap = 8;
      const offset = (thumbnailWidth + gap) * startIndex;
      containerRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [startIndex]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-96 overflow-hidden border border-gray-400">
        <img
          src={imageSources[selectedIndex]}
          alt="product"
          className="flex h-full w-full object-cover"
        />
      </div>
      <div className="flex w-full items-center gap-2 mt-2 w-full max-w-md">
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          className="p-2 bg-gray-200 disabled:opacity-50"
        >
          ◀
        </button>

        <div className="overflow-hidden w-full flex-1">
          <div
            ref={containerRef}
            className="flex gap-2 w-full transition-transform duration-300"
          >
            {imageSources.map((src, index) => (
              <div
                key={index}
                className={`w-24 h-24 flex-shrink-0 border-2 cursor-pointer overflow-hidden ${
                  selectedIndex === index
                    ? "border-blue-500"
                    : "border-gray-400"
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  updateStartIndex(index);
                }}
              >
                <img
                  src={src}
                  alt={`product-${index}`}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedIndex === imageSources.length - 1}
          className="p-2 bg-gray-200 disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default Collage;
