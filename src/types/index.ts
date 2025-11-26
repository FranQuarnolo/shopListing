export interface ShoppingItem {
    id: string;
    name: string;
    purchased: boolean;
    price?: number;
}

export interface SavedList {
    id: string;
    title: string;
    date: string; // ISO string
    total: number;
    items: ShoppingItem[];
}
