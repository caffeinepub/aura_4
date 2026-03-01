/**
 * Normalizes item photo paths for safe rendering.
 * Ensures local asset paths are consistently formatted and handles edge cases.
 */
export function normalizePhotoPath(photo: string | undefined | null): string {
  if (!photo || photo.trim() === '') {
    return '';
  }

  const trimmedPhoto = photo.trim();

  // If it's already a full URL (http/https), return as-is
  if (trimmedPhoto.startsWith('http://') || trimmedPhoto.startsWith('https://')) {
    return trimmedPhoto;
  }

  // If it starts with /assets/, ensure it's properly formatted
  if (trimmedPhoto.startsWith('/assets/')) {
    return trimmedPhoto;
  }

  // If it doesn't start with /, add it
  if (!trimmedPhoto.startsWith('/')) {
    return `/${trimmedPhoto}`;
  }

  return trimmedPhoto;
}
