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
      const firstChild = containerRef.current.children[0];
      const thumbnailWidth = firstChild ? firstChild.clientWidth : 0;

      const gap = 8;
      const offset = (thumbnailWidth + gap) * startIndex;
      containerRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [startIndex, imageSources.length]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="h-96 w-full overflow-hidden border border-gray-400 bg-gray-100">
        <img
          src={imageSources[selectedIndex]}
          alt="product"
          className="flex w-full h-full object-contain md:object-cover" // object-contain щоб не обрізало на мобільному
        />
      </div>

      <div className="flex items-center gap-2 mt-2 w-full h-24">
        {imageSources.length > 3 && (
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="h-full w-10 flex-shrink-0 flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
          >
            <span className="text-xl font-bold text-gray-600">{"<"}</span>
          </button>
        )}

        {imageSources.length > 1 && (
          <div className="overflow-hidden w-full h-full p-px">
            <div
              ref={containerRef}
              className="flex gap-2 transition-transform duration-300 h-full"
            >
              {imageSources.map((src, index) => (
                <div
                  key={index}
                  className={`h-full w-[calc(33.333%-6px)] flex-shrink-0 border cursor-pointer overflow-hidden box-border ${
                    selectedIndex === index
                      ? "border-blue-500 border-2"
                      : "border-gray-400 border"
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
        )}

        {imageSources.length > 3 && (
          <button
            onClick={handleNext}
            disabled={selectedIndex === imageSources.length - 1}
            className="h-full w-10 flex-shrink-0 flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
          >
            <span className="text-xl font-bold text-gray-600">{">"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Collage;
