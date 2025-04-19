import { Paperclip } from "lucide-react";
import { useState, useRef, FC } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ImageUploaderProps {
  onImageCropped: (croppedImage: string) => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ onImageCropped }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = (sourceImage: HTMLImageElement, cropConfig: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = cropConfig.width * scaleX;
    canvas.height = cropConfig.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleCropComplete = () => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImage(imageRef.current, crop);
      if (croppedImageUrl) {
        onImageCropped(croppedImageUrl);
        setIsDialogOpen(false);
        setSelectedImage(null);
      }
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="relative p-1 rounded-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Paperclip className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Attach files</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white text-black dark:text-white dark:bg-gray-900 p-5 rounded-lg shadow-lg z-[1000] max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              Crop Image
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative mt-2">
              <div className="max-h-[60vh] overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={16 / 9}
                  className="max-w-full"
                >
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Crop me"
                    className="max-w-full max-h-[55vh] object-contain"
                  />
                </ReactCrop>
              </div>
            </div>
          )}
          <DialogFooter className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedImage(null);
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
