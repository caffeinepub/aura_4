import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClothingItem, Category } from '../../backend';
import { useGetItemShopCount } from '../../hooks/useAuraQueries';
import { Store, Loader2 } from 'lucide-react';
import { normalizePhotoPath } from '../../utils/assetPaths';
import { useState } from 'react';

const categoryLabels: Record<Category, string> = {
  [Category.men]: 'Men',
  [Category.women]: 'Women',
  [Category.kids]: 'Kids',
  [Category.casual]: 'Casual',
  [Category.bridal]: 'Bridal',
};

interface ItemCardProps {
  item: ClothingItem;
  onClick: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const { data: shopCount, isLoading: isLoadingShopCount } = useGetItemShopCount(item.name);
  const normalizedPhoto = normalizePhotoPath(item.photo);
  const hasPhoto = normalizedPhoto !== '';
  const [imageError, setImageError] = useState(false);

  const shouldShowFallback = !hasPhoto || imageError;

  const handleImageError = () => {
    console.warn(
      `[ItemCard] Failed to load image for item "${item.name}". Attempted src: "${normalizedPhoto}"`
    );
    setImageError(true);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 overflow-hidden bg-card/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {shouldShowFallback ? (
          <img
            src="/assets/generated/aura-icon-hanger.dim_256x256.png"
            alt={item.name}
            className="w-24 h-24 object-contain opacity-40 group-hover:opacity-60 transition-opacity"
          />
        ) : (
          <img
            src={normalizedPhoto}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {categoryLabels[item.category]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.itemType}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{item.color}</span> • {item.pattern}
            </p>
            <p className="font-semibold text-primary">₹{item.price.toString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t min-h-[24px]">
          {isLoadingShopCount ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading shops...</span>
            </>
          ) : shopCount !== undefined && shopCount > 0 ? (
            <>
              <Store className="w-3 h-3" />
              <span>
                Available at {shopCount} {shopCount === 1 ? 'shop' : 'shops'}
              </span>
            </>
          ) : (
            <>
              <Store className="w-3 h-3 opacity-50" />
              <span className="opacity-50">No shops available</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
