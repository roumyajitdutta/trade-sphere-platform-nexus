
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductImageCarouselProps {
  images: string[];
  productTitle: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ 
  images, 
  productTitle 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const productImages = images.length > 0 ? images : ['/placeholder.svg'];

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleImageHover = (isHovering: boolean) => {
    setIsZoomed(isHovering);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
          <img
            src={productImages[selectedImageIndex]}
            alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-110' : 'scale-100'
            }`}
            onMouseEnter={() => handleImageHover(true)}
            onMouseLeave={() => handleImageHover(false)}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* Expand Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={openFullscreen}
          >
            <Expand className="w-4 h-4" />
          </Button>

          {/* Navigation Arrows for Main Image */}
          {productImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedImageIndex(
                  selectedImageIndex === 0 ? productImages.length - 1 : selectedImageIndex - 1
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedImageIndex(
                  selectedImageIndex === productImages.length - 1 ? 0 : selectedImageIndex + 1
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnail Carousel */}
        {productImages.length > 1 && (
          <div className="w-full">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {productImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4 md:basis-1/5">
                    <button
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative aspect-square w-full rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${productTitle} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsFullscreenOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={productImages[selectedImageIndex]}
                alt={`${productTitle} - Fullscreen`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Fullscreen Navigation */}
            {productImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex === 0 ? productImages.length - 1 : selectedImageIndex - 1
                  )}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex === productImages.length - 1 ? 0 : selectedImageIndex + 1
                  )}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {productImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageCarousel;
