import { FormEvent, useEffect, useState } from 'react';
import { Lot, Product } from '@/app/models/product';

import { RefreshCcw } from 'react-feather';
import api from '@/app/api/api';

interface ProductFormProps {
    show: boolean;
    product: Product;
    onClose: () => void;
    onSubmit: (product: Product) => void;
}

const EditProduct: React.FC<ProductFormProps> = ({ show, product, onClose, onSubmit }) => {
    const [name, setName] = useState(product.name);
    const formatDateYYYYMMDD = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [dateExpiry, setDateExpiry] = useState(() => formatDateYYYYMMDD(product.date_expiry));
    const [lotsOptions, setLotsOptions] = useState<Lot[]>([]);
    const [selectedLot, setSelectedLot] = useState<string>('');
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState(product.status.name);
    const [price, setPrice] = useState<number>(product.price);
    const [stock, setStock] = useState<number>(product.stock);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await api.listStatus();
                setStatusOptions(response);
            } catch (error) {
                console.error('Error fetching statuses:', error);
            }
        };

        const fetchLots = async () => {
            try {
                const response = await api.listLots();
                setLotsOptions(response);
                const selectedProductLot = response.find(lot => lot.code === product.lot);
                if (selectedProductLot) {
                    setSelectedLot(selectedProductLot.code);
                }
            } catch (error) {
                console.error('Error fetching lots:', error);
            }
        };

        fetchStatuses();
        fetchLots();
    }, [product]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...product,
            name,
            date_expiry: dateExpiry,
            status: { name: selectedStatus },
            price,
            stock,
        });
        setSuccessMessage('!Producto actualizado exitosamente')
        setTimeout(() => {
            setSuccessMessage('')
            onClose();
        }, 1000)
    };
    if (!show) {
        return null;
    }
    return (

        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-600  p-6 rounded shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre producto</label>
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ingrese el nombre" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                            <input type="number" name="price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$12.5" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stock</label>
                            <input type="number" name="stock" value={stock} onChange={(e) => setStock(parseFloat(e.target.value))} id="stock" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="0" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha expiracion</label>
                            <input type="date" name="date_expiry" value={dateExpiry} onChange={(e) => setDateExpiry(e.target.value)} id="date_expiry" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="mm/dd/yyyy" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado del producto</label>
                            <select id="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar el lote</label>
                            <select id="lot" value={selectedLot} onChange={(e) => setSelectedLot(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                {lotsOptions.map((lot) => (
                                    <option key={lot.external_id} value={lot.code}>{lot.code}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {successMessage && (
                        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                                <span className="font-medium">{successMessage}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex space-x-4">
                        <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <RefreshCcw className="w-5 h-5 mr-2" />
                            Actualizar
                        </button>
                        <button
                            type="button"
                            className="text-white inline-flex items-center bg-midnight hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-60"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
