import { Category } from '../backend';
import { User, Shirt, Baby, Coffee, Heart, Tag, LucideIcon } from 'lucide-react';

/**
 * Returns a human-readable English label for a category.
 * Falls back to a capitalized version of the category string if not found.
 */
export function getCategoryLabel(category: Category | string): string {
  const labels: Record<Category, string> = {
    [Category.men]: 'Men',
    [Category.women]: 'Women',
    [Category.kids]: 'Kids',
    [Category.casual]: 'Casual',
    [Category.bridal]: 'Bridal',
  };

  // If it's a known category, return the label
  if (category in labels) {
    return labels[category as Category];
  }

  // Fallback: capitalize the string value
  const categoryStr = String(category);
  return categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
}

/**
 * Returns an icon component class for a category.
 * Falls back to a generic Tag icon if the category is unknown.
 */
export function getCategoryIconComponent(category: Category | string): LucideIcon {
  const icons: Record<Category, LucideIcon> = {
    [Category.men]: User,
    [Category.women]: Shirt,
    [Category.kids]: Baby,
    [Category.casual]: Coffee,
    [Category.bridal]: Heart,
  };

  // If it's a known category, return the icon component
  if (category in icons) {
    return icons[category as Category];
  }

  // Fallback: generic tag icon
  return Tag;
}
