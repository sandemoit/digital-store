import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const initialDisplayCount = 5;

  const showMoreThumbnails = () => {
    setVisibleThumbnails(prevCount => prevCount + 5);
  };

  const showLessThumbnails = () => {
    setVisibleThumbnails(initialDisplayCount);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setModalImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  const displayedThumbnails = images.slice(0, visibleThumbnails);
  const hasMoreThumbnails = images.length > visibleThumbnails;
  const canMinimize = visibleThumbnails > initialDisplayCount;

  return (
    <>
      <div className="md:bg-white md:rounded-sm md:shadow md:p-6">
        <div className="md:mb-4 relative group">
          <LazyLoadImage
            src={images[selectedImage]}
            alt="Product preview"
            className="w-full h-[56.25vw] md:h-auto object-cover md:rounded-sm cursor-pointer"
            onClick={() => openModal(selectedImage)}
          />

          <div
            className="absolute inset-0 cursor-zoom-in group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
            onClick={() => openModal(selectedImage)}
          >
            <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
              <ZoomIn className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-lg md:bg-transparent md:rounded-none md:p-0">
          <div className="grid grid-cols-5 md:gap-2">
            {displayedThumbnails.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 md:rounded-sm overflow-hidden ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'} hover:border-orange-300 transition-colors`}
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

      {/* Modal for zoomed image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 bg-black bg-opacity-50 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-black bg-opacity-50 rounded-full p-2"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 bg-black bg-opacity-50 rounded-full p-2"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="max-w-full max-h-full flex items-center justify-center">
            <LazyLoadImage
              src={images[modalImageIndex]}
              alt={`Product image ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {modalImageIndex + 1} / {images.length}
          </div>

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-sm overflow-x-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded overflow-hidden flex-shrink-0 ${modalImageIndex === index ? 'border-orange-500' : 'border-gray-400'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(index);
                  }}
                >
                  <LazyLoadImage
                    src={image}
                    alt={`Thumbnail ${index}`}
                    className="w-12 h-12 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}