import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ClothingItem, Category, ExternalBlob } from '../../backend';
import { useGetItemDetails, useUploadItemPhoto } from '../../hooks/useAuraQueries';
import { Loader2, MapPin, Phone, Store, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { normalizePhotoPath } from '../../utils/assetPaths';
import { useState, useRef, useEffect } from 'react';

const categoryLabels: Record<Category, string> = {
  [Category.men]: 'Men',
  [Category.women]: 'Women',
  [Category.kids]: 'Kids',
  [Category.casual]: 'Casual',
  [Category.bridal]: 'Bridal',
};

interface ItemDetailDialogProps {
  item: ClothingItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const { data, isLoading, error } = useGetItemDetails(item.name, open);
  const uploadMutation = useUploadItemPhoto();
  const [imageError, setImageError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const displayItem = data ? data[0] : item;
  const shops = data ? data[1] : [];
  
  // Use uploaded photo URL if available, otherwise use the item's photo
  const photoToDisplay = uploadedPhotoUrl || displayItem.photo;
  const normalizedPhoto = normalizePhotoPath(photoToDisplay);
  const hasPhoto = normalizedPhoto !== '';

  const shouldShowFallback = !hasPhoto || imageError;

  const handleImageError = () => {
    console.warn(
      `[ItemDetailDialog] Failed to load image for item "${displayItem.name}". Attempted src: "${normalizedPhoto}"`
    );
    setImageError(true);
  };

  // Reset image error state when dialog opens with a new item
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setImageError(false);
      setSelectedFile(null);
      setUploadedPhotoUrl(null);
    }
    onOpenChange(newOpen);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      await uploadMutation.mutateAsync({
        itemName: displayItem.name,
        imageBytes: uint8Array,
      });

      // After successful upload, get the photo from backend to display
      const blob = ExternalBlob.fromBytes(uint8Array);
      const directUrl = blob.getDirectURL();
      setUploadedPhotoUrl(directUrl);
      setImageError(false);
      setSelectedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // Clear uploaded photo URL when data changes (new item loaded)
  useEffect(() => {
    if (data) {
      setUploadedPhotoUrl(null);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{displayItem.name}</DialogTitle>
          <DialogDescription>
            View details and shop availability in Bangalore
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-center aspect-video bg-muted rounded-lg overflow-hidden">
            {shouldShowFallback ? (
              <img
                src="/assets/generated/aura-icon-hanger.dim_256x256.png"
                alt={displayItem.name}
                className="w-32 h-32 object-contain opacity-40"
              />
            ) : (
              <img
                src={normalizedPhoto}
                alt={displayItem.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploadMutation.isPending}
                className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                size="sm"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
            {uploadMutation.isError && (
              <p className="text-sm text-destructive">
                Failed to upload photo. Please try again.
              </p>
            )}
            {uploadMutation.isSuccess && !uploadMutation.isPending && (
              <p className="text-sm text-green-600">
                Photo uploaded successfully!
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Item Details</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{categoryLabels[displayItem.category]}</Badge>
                <Badge variant="outline">{displayItem.itemType}</Badge>
                <Badge variant="outline">{displayItem.color}</Badge>
                <Badge variant="outline">{displayItem.pattern}</Badge>
              </div>
              <p className="text-2xl font-bold text-primary mt-3">₹{displayItem.price.toString()}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Available at These Shops
              </h3>

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-destructive">
                  <p>Error loading shop details</p>
                </div>
              )}

              {!isLoading && !error && shops.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No shops found for this item</p>
                </div>
              )}

              {!isLoading && !error && shops.length > 0 && (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {shops.map((shop, index) => (
                      <div
                        key={`${shop.name}-${index}`}
                        className="p-4 rounded-lg border bg-card/50 space-y-2 hover:bg-card transition-colors"
                      >
                        <h4 className="font-semibold text-lg">{shop.name}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <a
                              href={`tel:${shop.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              {shop.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{shop.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
