export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryName?: string;
  image?: string;
  available: boolean;
  preparationTime: number; // in minutes
  spicy?: boolean;
  vegetarian?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  preparationTime: number;
  spicy?: boolean;
  vegetarian?: boolean;
}
