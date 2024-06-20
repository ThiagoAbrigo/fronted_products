'use client'

import React, { useEffect, useState } from 'react';

import Navbar from '../components/navbar/Navbar';
import { Product } from '../models/product';
import ProductCard from '../components/cards/ProductCard';
import api from '../api/api';

const ImageGallery = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await api.listGalery();
                setProducts(response);
            } catch (error) {
                console.error('Error al cargar las imágenes:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="mt-24">
                <h1 className="text-3xl font-bold text-center mb-6">Galería de Productos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.name} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
