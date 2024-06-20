export interface Product {
    name: string;
    date_expiry: string;
    status: { name: string };
    price: number;
    lot: string;
    stock: number
    external_id: string;
    image_path:string;
}
export interface Lot {
    code: string;
    external_id: string;
    quantity: number;
    user_name:string;
    products: { product_name: string }[];
}
