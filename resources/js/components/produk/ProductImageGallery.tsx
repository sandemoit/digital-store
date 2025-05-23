import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const initialDisplayCount = 5;

  const showMoreThumbnails = () => {
    setVisibleThumbnails(prevCount => prevCount + 5);
  };

  const showLessThumbnails = () => {
    setVisibleThumbnails(initialDisplayCount);
  };

  const displayedThumbnails = images.slice(0, visibleThumbnails);
  const hasMoreThumbnails = images.length > visibleThumbnails;
  const canMinimize = visibleThumbnails > initialDisplayCount;

  return (
    <div className="md:bg-white md:rounded-sm md:shadow md:p-6">
      <div className="md:mb-4">
        <LazyLoadImage
          src={images[selectedImage]}
          alt="Product preview"
          className="w-full h-[56.25vw] md:h-auto object-cover md:rounded-sm"
        />
      </div>
      <div className="bg-white rounded-b-lg md:bg-transparent md:rounded-none md:p-0">
        <div className="grid grid-cols-5 md:gap-2">
          {displayedThumbnails.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 md:rounded-sm overflow-hidden ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'}`}
              onClick={() => setSelectedImage(index)}
            >
              <LazyLoadImage
                src={image}
                alt={`Thumbnail ${index}`}
                className="w-full h-16 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="py-4 md:py-0 md:pt-4 text-center flex justify-center gap-4">
          {hasMoreThumbnails && (
            <button
              onClick={showMoreThumbnails}
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              Lihat gambar lainnya ({images.length - visibleThumbnails})
            </button>
          )}

          {canMinimize && (
            <button
              onClick={showLessThumbnails}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Tampilkan lebih sedikit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
