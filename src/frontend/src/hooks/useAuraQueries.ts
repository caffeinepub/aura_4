import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, ClothingItem, ExternalBlob } from '../backend';

export function useListCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchItems(
  category: Category | null,
  itemType: string | null,
  color: string | null,
  pattern: string | null
) {
  const { actor, isFetching } = useActor();

  return useQuery<ClothingItem[]>({
    queryKey: ['searchItems', category, itemType, color, pattern],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchItems(category, itemType, color, pattern);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetItemDetails(itemName: string, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['itemDetails', itemName],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getItemDetails(itemName);
    },
    enabled: !!actor && !isFetching && enabled && !!itemName,
  });
}

export function useGetItemShopCount(itemName: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['itemShopCount', itemName],
    queryFn: async () => {
      if (!actor) return 0;
      const result = await actor.getItemDetails(itemName);
      return result[1].length;
    },
    enabled: !!actor && !isFetching && !!itemName,
  });
}

export function useUploadItemPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemName, imageBytes }: { itemName: string; imageBytes: Uint8Array }) => {
      if (!actor) throw new Error('Backend actor not initialized');
      
      // Create a new Uint8Array with ArrayBuffer to satisfy type requirements
      const typedArray = new Uint8Array(imageBytes) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(typedArray);
      const result = await actor.attachPhotoToItem(itemName, blob);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate the item details query to refresh the displayed photo
      queryClient.invalidateQueries({ queryKey: ['itemDetails', variables.itemName] });
    },
  });
}
