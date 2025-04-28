import { useState } from "react";

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <img
          src={images[selectedImage]}
          alt="Product preview"
          className="w-full h-94 object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {displayedThumbnails.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer border-2 rounded-md overflow-hidden ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'}`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={image} alt={`Thumbnail ${index}`} className="w-full h-16 object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-4 text-center flex justify-center gap-4">
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
  );
}
