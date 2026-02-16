import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useListCategories } from '../hooks/useAuraQueries';
import { Loader2, Shirt, User, Baby, Coffee, Heart } from 'lucide-react';
import { Category } from '../backend';

const categoryIcons: Record<Category, React.ReactNode> = {
  [Category.men]: <User className="w-8 h-8" />,
  [Category.women]: <Shirt className="w-8 h-8" />,
  [Category.kids]: <Baby className="w-8 h-8" />,
  [Category.casual]: <Coffee className="w-8 h-8" />,
  [Category.bridal]: <Heart className="w-8 h-8" />,
};

const categoryLabels: Record<Category, string> = {
  [Category.men]: 'Men',
  [Category.women]: 'Women',
  [Category.kids]: 'Kids',
  [Category.casual]: 'Casual',
  [Category.bridal]: 'Bridal',
};

export default function CategorySelectionPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading, error } = useListCategories();

  const handleCategorySelect = (category: Category) => {
    navigate({ to: '/search', search: { category } });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Categories</CardTitle>
            <CardDescription>
              We couldn't load the categories. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: 'url(/assets/generated/aura-hero-bg.dim_1600x900.png)' }}
      />
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Discover Your Style
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore fashion across Bangalore's finest boutiques. Select a category to begin your
              search.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Card
                key={category}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50 bg-card/80 backdrop-blur-sm"
                onClick={() => handleCategorySelect(category)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {categoryIcons[category]}
                  </div>
                  <CardTitle className="text-2xl">{categoryLabels[category]}</CardTitle>
                  <CardDescription>Browse {categoryLabels[category].toLowerCase()} fashion</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
