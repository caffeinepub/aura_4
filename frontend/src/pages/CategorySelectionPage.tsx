import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useListCategories } from '../hooks/useAuraQueries';
import { Loader2 } from 'lucide-react';
import { Category } from '../backend';
import { getCategoryIconComponent, getCategoryLabel } from '../utils/categoryPresentation';

export default function CategorySelectionPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading, error, refetch } = useListCategories();

  // Trigger refetch when page is entered
  useEffect(() => {
    refetch();
  }, [refetch]);

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
            {categories?.map((category) => {
              const label = getCategoryLabel(category);
              const IconComponent = getCategoryIconComponent(category);
              
              return (
                <Card
                  key={category}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50 bg-card/80 backdrop-blur-sm"
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{label}</CardTitle>
                    <CardDescription>Browse {label.toLowerCase()} fashion</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
