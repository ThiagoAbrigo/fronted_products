'use client'

import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { Lot } from '@/app/models/product';
import Navbar from '../../navbar/Navbar';
import React from 'react';
import api from '@/app/api/api';

const ContentLot: React.FC = () => {
    const [lots, setLots] = useState<Lot[]>([]);

    const token = Cookies.get('token');
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await api.listLots(token);
                setLots(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="mt-24">
            <h1 className="text-3xl font-bold text-center mb-6">Administracion de Lotes</h1>
            <section className="bg-gray-50 p-10">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 justify-between items-center">
                                <span>Lista de Lotes</span>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Numero
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Codigo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Cantidad
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Registrado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lots.map((lot, index) => (
                                    <tr key={lot.external_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">
                                            {lot.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lot.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ul>
                                                {lot.products.map((product, idx) => (
                                                    <li key={idx}>{product.product_name}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4">
                                            {lot.user_name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            </div>
        </div>

    );
};

export default ContentLot;