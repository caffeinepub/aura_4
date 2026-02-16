import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search } from 'lucide-react';
import { Category } from '../backend';

const categoryLabels: Record<Category, string> = {
  [Category.men]: 'Men',
  [Category.women]: 'Women',
  [Category.kids]: 'Kids',
  [Category.casual]: 'Casual',
  [Category.bridal]: 'Bridal',
};

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { category?: Category };
  const selectedCategory = searchParams.category;

  const [itemType, setItemType] = useState('');
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');

  const handleSearch = () => {
    navigate({
      to: '/results',
      search: {
        category: selectedCategory,
        itemType: itemType || undefined,
        color: color || undefined,
        pattern: pattern || undefined,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Search Fashion</CardTitle>
            <CardDescription>
              {selectedCategory
                ? `Searching in ${categoryLabels[selectedCategory]} category`
                : 'Search across all categories'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="itemType">Item Type</Label>
              <Input
                id="itemType"
                placeholder="e.g., Shirt, Dress, Pants"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                What type of clothing are you looking for?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., Blue, Red, White"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Preferred color or shade
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Pattern</Label>
              <Input
                id="pattern"
                placeholder="e.g., Solid, Striped, Floral"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Pattern or design style
              </p>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full"
              size="lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Items
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
