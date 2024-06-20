import { Product } from '@/app/models/product';
import React from 'react';

interface ProductCardProps {
    product: Product;
}
const ProductCard: React.FC<ProductCardProps>  = ({ product }) => {
    return (
        <div className="w-full md:w-1/8 lg:w-1/8 p-1">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img className="h-48 w-full rounded-t-lg" src={`http://localhost:5000/uploads/${product.image_path}`} alt={product.name}/>
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-center text-gray-900 dark:text-white">{product.name}</h5>
                </a>
            </div>
        </div>
        </div>
    );
};

export default ProductCard;
