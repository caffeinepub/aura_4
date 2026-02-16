import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ClothingItem {
    pattern: string;
    name: string;
    color: string;
    itemType: string;
    category: Category;
    photo: string;
    price: bigint;
}
export interface Shop {
    clothing: Array<ClothingItem>;
    name: string;
    phone: string;
    location: string;
}
export enum Category {
    men = "men",
    bridal = "bridal",
    kids = "kids",
    casual = "casual",
    women = "women"
}
export interface backendInterface {
    addClothingItem(shopName: string, item: ClothingItem): Promise<void>;
    attachPhotoToItem(itemName: string, blob: ExternalBlob): Promise<string>;
    getItemDetails(itemName: string): Promise<[ClothingItem, Array<Shop>]>;
    getItemPhoto(itemName: string): Promise<ExternalBlob | null>;
    listCategories(): Promise<Array<Category>>;
    searchItems(category: Category | null, itemType: string | null, color: string | null, pattern: string | null): Promise<Array<ClothingItem>>;
}
