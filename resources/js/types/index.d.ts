export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    product: Product;
    subtotal: number;
}

export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    total: number;
    item_count: number;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: Product;
    subtotal: number;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
