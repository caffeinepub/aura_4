import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSearchItems } from '../hooks/useAuraQueries';
import { Category, ClothingItem } from '../backend';
import ItemCard from '../components/aura/ItemCard';
import ItemDetailDialog from '../components/aura/ItemDetailDialog';

const categoryLabels: Record<Category, string> = {
  [Category.men]: 'Men',
  [Category.women]: 'Women',
  [Category.kids]: 'Kids',
  [Category.casual]: 'Casual',
  [Category.bridal]: 'Bridal',
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as {
    category?: Category;
    itemType?: string;
    color?: string;
    pattern?: string;
  };

  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  const { data: items, isLoading, error } = useSearchItems(
    searchParams.category || null,
    searchParams.itemType || null,
    searchParams.color || null,
    searchParams.pattern || null
  );

  const handleBack = () => {
    navigate({
      to: '/search',
      search: { category: searchParams.category },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Searching for items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <Card className="max-w-md mx-auto border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Search Error</CardTitle>
            <CardDescription>
              We couldn't complete your search. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const hasFilters =
    searchParams.category || searchParams.itemType || searchParams.color || searchParams.pattern;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Search
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {hasFilters && (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {searchParams.category && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                {categoryLabels[searchParams.category]}
              </span>
            )}
            {searchParams.itemType && (
              <span className="px-3 py-1 rounded-full bg-accent">
                Type: {searchParams.itemType}
              </span>
            )}
            {searchParams.color && (
              <span className="px-3 py-1 rounded-full bg-accent">
                Color: {searchParams.color}
              </span>
            )}
            {searchParams.pattern && (
              <span className="px-3 py-1 rounded-full bg-accent">
                Pattern: {searchParams.pattern}
              </span>
            )}
          </div>
        )}
      </div>

      {!items || items.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center py-12">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <img
                src="/assets/generated/aura-icon-hanger.dim_256x256.png"
                alt="No items"
                className="w-10 h-10 opacity-50"
              />
            </div>
            <CardTitle>No Items Found</CardTitle>
            <CardDescription>
              We couldn't find any items matching your search criteria. Try adjusting your filters.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            Found {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <ItemCard
                key={`${item.name}-${index}`}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </>
      )}

      {selectedItem && (
        <ItemDetailDialog
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      )}
    </div>
  );
}
