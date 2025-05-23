import { Search } from "lucide-react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const HeroSection = () => {

  return (
    <section className="py-6 md:py-33 relative overflow-hidden container mx-auto lg:max-w-[1320px]">
      {/* Background Elements */}
      <div className="absolute left-0 bottom-0 -mb-10 text-orange-500 opacity-10">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0L200 0L200 200L0 0Z" />
        </svg>
      </div>

      <div className="absolute right-36 top-40 text-purple-500 opacity-10">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="40" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Pilihan yang Tepat Untuk
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
                Mewujudkan
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
                Bisnis Anda<span className="text-orange-600">.</span>
              </span>
            </h1>

            <p className="text-black text-lg mb-10">
              Temukan koleksi produk digital premium terbaik untuk meningkatkan
              bisnis dan kreativitas Anda.
            </p>

            <div className="flex flex-col sm:flex-row w-full max-w-lg items-center gap-3 ">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search size={20} className="text-gray-700" />
                </div>
                <input
                  type="text"
                  placeholder="Cari produk digital..."
                  className="pl-12 w-full px-5 py-4 rounded-sm bg-white transition-[border,box-shadow] focus:outline-none focus:border-2 focus:border-orange-500 focus:shadow-lg"
                />
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-4 rounded-sm whitespace-nowrap transition-[background-color,border,box-shadow] hover:shadow-lg z-1">
                Search
              </button>
            </div>
          </div>

          {/* Right Content - Image Gallery */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 flex justify-center">
              {/* Main Featured Image */}
              <div className="w-3/4 rounded-sm shadow-xl overflow-hidden transform translate-y-8">
                <LazyLoadImage
                  alt="Featured Digital Product"
                  src="https://picsum.photos/800/500?random=1"
                  className="w-full h-auto"
                />
              </div>

              {/* Smaller Image 1 */}
              <div className="absolute top-0 -left-4 w-1/3 rounded-sm shadow-lg overflow-hidden">
                <LazyLoadImage
                  alt="Featured Digital Product"
                  src="https://picsum.photos/800/500?random=2"
                  className="w-full h-auto"
                />
              </div>

              {/* Smaller Image 2 */}
              <div className="absolute bottom-0 -right-4 w-1/3 rounded-sm shadow-lg overflow-hidden">
                <LazyLoadImage
                  alt="Featured Digital Product"
                  src="https://picsum.photos/800/500?random=3"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-orange-100"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-orange-100"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-orange-100"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
