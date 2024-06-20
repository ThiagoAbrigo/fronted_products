'use client'

import { useEffect, useState } from 'react';

import ChangeImage from '../components/modals/ChangeImage';
import Cookies from 'js-cookie';
import CreateProduct from '../components/modals/CreateProdcut';
import EditProduct from '../components/modals/EditProduct';
import Navbar from '../components/navbar/Navbar';
import { Product } from '../models/product';
import React from 'react';
import api from '../api/api';
import { useRouter } from 'next/navigation';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES'); // Cambia 'es-ES' por tu localización deseada
}
const Dashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [tokenExpired, setTokenExpired] = useState(false);
    const router = useRouter();
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selected, setSelected] = useState('Seleccionar');
    const [showModalChangeImage, setShowModalChangeImage] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const token = Cookies.get('token');
    useEffect(() => {

        if (!token || checkIfTokenExpired(token)) {
            setTokenExpired(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
    }, []);

    function checkIfTokenExpired(expire: any) {
        if (!expire) {
            return true;
        }
        const expirationDate = new Date(expire);
        const currentDate = new Date();
        return expirationDate < currentDate;
    }
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await api.listProducts(token);
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        const fetchProducts = async () => {
            let response = [];
            if (selected === 'Seleccionar') {
                response = await api.listProducts(token);
            } else {
                switch (selected) {
                    case 'Bueno':
                        response = await api.listBuenos(token);
                        break;
                    case 'Caducado':
                        response = await api.listCaducados(token);
                        break;
                    case 'A punto de caducar':
                        response = await api.ListApuntodecaducar(token);
                        break;
                    default:
                        response = [];
                        break;
                }
            }

            setProducts(response);
        };

        fetchProducts()
    }, [selected, token]);

    const handleAddProduct = async (formData: FormData) => {
        try {
            await api.saveProduct(formData);
            const updatedProducts = await api.listProducts();
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error al añadir el producto:', error);
        }
    };

    const handleEditProduct = async (editedProduct: Product) => {
        try {
            await api.modifyProduct(editedProduct, editedProduct.external_id);
            const updatedProducts = await api.listProducts();
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowModalEdit(true);
    };
    const openChangeImageModal = (product: Product) => {
        setSelectedProduct(product);
        setShowModalChangeImage(true);
    };

    const closeChangeImageModal = () => {
        setShowModalChangeImage(false);
        setSelectedProduct(null);
    };
    return (
        <div>
            <Navbar />
            <div className="mt-24">
            <h1 className="text-3xl font-bold text-center mb-6">Administracion de Productos</h1>
            {tokenExpired && (
                <div className="alert-container" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
                    <div className="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-white-50 dark:bg-gray-100 dark:text-red-500 dark:border-yellow-800" role="alert">
                        <div className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">¡La sesión ha expirado!</h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                            Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
                        </div>
                    </div>
                </div>
            )}
            <section className="bg-gray-50 p-10">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 justify-between items-center">
                                <div className="flex justify-end items-center">
                                    <div>
                                        <label htmlFor="large" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Filtrar Estados</label>
                                        <select id="large" value={selected} onChange={(e) => setSelected(e.target.value)} className="block w-60 mt-2 px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="Seleccionar">Seleccionar</option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Caducado">Caducado</option>
                                            <option value="A punto de caducar">A punto de caducar</option>
                                        </select>
                                    </div>
                                </div>
                                <span>Lista de productos</span>
                                <button onClick={() => setShowModalCreate(true)} data-modal-target="crud-modal" data-modal-toggle="crud-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ml-[13%] -mt-8 dark:focus:ring-blue-800">
                                    Registrar producto
                                </button>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Fecha de expiracion
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Precio
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Lote
                                    </th>
                                    <th scope="col" className="px-12 py-3">
                                        Imagen
                                    </th>
                                    <th scope="col" className="px-20 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.external_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {product.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {formatDate(product.date_expiry)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.status ? product.status.name : 'Sin estado'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.lot}
                                        </td>
                                        <td className="px-6 py-4">
                                            <img src={`http://localhost:5000/uploads/${product.image_path}`} alt={product.name} style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="bg-midnight text-white px-4 py-2 mr-2 rounded" onClick={() => openChangeImageModal(product)}>
                                                Cambiar Imagen
                                            </button>
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            </div>
            {showModalCreate && (
                <CreateProduct
                    show={showModalCreate}
                    onClose={() => setShowModalCreate(false)}
                    onSubmit={handleAddProduct}
                />
            )}
            {showModalEdit && selectedProduct && (
                <EditProduct
                    show={showModalEdit}
                    product={selectedProduct}
                    onClose={() => setShowModalEdit(false)}
                    onSubmit={handleEditProduct}
                />
            )}
            {showModalChangeImage && (
                <ChangeImage
                    show={showModalChangeImage}
                    onClose={closeChangeImageModal}
                    product={selectedProduct}
                />
            )}
        </div>

    );
};

export default Dashboard;