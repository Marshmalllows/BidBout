import React, { useState, useEffect, useRef } from "react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (containerRef.current && containerRef.current.children[0]) {
      const firstChild = containerRef.current.children[0];
      const thumbnailWidth = firstChild.clientWidth;
      const gap = 8;
      const offset = (thumbnailWidth + gap) * startIndex;
      containerRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [startIndex, imageSources.length]);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div
          className="h-96 w-full overflow-hidden border border-gray-400 bg-gray-100 cursor-zoom-in"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={imageSources[selectedIndex]}
            alt="product"
            className="flex w-full h-full object-cover hover:opacity-95 transition-opacity"
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

      {isModalOpen && (
        <ImageModal
          src={imageSources[selectedIndex]}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const newScale = Math.min(Math.max(1, scale + e.deltaY * -0.001), 4);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: clientX - position.x, y: clientY - position.y });
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging && scale > 1) {
      const newX = clientX - startPos.x;
      const newY = clientY - startPos.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleEnd = () => setIsDragging(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden touch-none"
      onWheel={handleWheel}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[10000] text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="absolute bottom-10 flex gap-4 z-[10000]">
        <button
          onClick={() => setScale((s) => Math.max(1, s - 0.5))}
          className="bg-white/20 text-white p-3 rounded-full hover:bg-white/40 backdrop-blur-sm"
        >
          -
        </button>
        <button
          onClick={() => {
            setPosition({ x: 0, y: 0 });
            setScale(1);
          }}
          className="bg-white/20 text-white px-4 py-3 rounded-full hover:bg-white/40 backdrop-blur-sm text-sm"
        >
          Reset
        </button>
        <button
          onClick={() => setScale((s) => Math.min(4, s + 0.5))}
          className="bg-white/20 text-white p-3 rounded-full hover:bg-white/40 backdrop-blur-sm"
        >
          +
        </button>
      </div>

      <div
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        onDoubleClick={() => {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        }}
      >
        <img
          src={src}
          alt="Fullscreen"
          className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out select-none pointer-events-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${
              position.y / scale
            }px)`,
          }}
        />
      </div>
    </div>
  );
}

export default Collage;
