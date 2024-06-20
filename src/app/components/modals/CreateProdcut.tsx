import { FormEvent, useEffect, useState } from 'react';
import { Lot, Product } from '@/app/models/product';

import api from '@/app/api/api';

interface ProductFormProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const CreateProduct: React.FC<ProductFormProps> = ({ show, onClose, onSubmit, }) => {
    const [name, setName] = useState('');
    const [dateExpiry, setDateExpiry] = useState('');
    const [lotsOptions, setLotsOptions] = useState<Lot[]>([]);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [price, setPrice] = useState<number | ''>('');
    const [stock, setStock] = useState<number | ''>('');
    const [image, setImage] = useState<File | null>(null);
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
            } catch (error) {
                console.error('Error fetching lots:', error);
            }
        };

        fetchStatuses();
        fetchLots();
    }, []);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedLot) {
            console.error('No se ha seleccionado un lote');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('date_expiry', dateExpiry);
            formData.append('price', String(price));
            formData.append('lot', selectedLot.code);
            formData.append('status', selectedStatus);
            formData.append('stock', String(stock));
            if (image) {
                formData.append('image', image);
            }
            const externalId = selectedLot.external_id;
            formData.append('external_id', externalId);

            await onSubmit(formData);
            setSuccessMessage('!Producto guardado exitosamente')
            setTimeout(() => {
                setSuccessMessage('')
                onClose();
            }, 1000)
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    if (!show) {
        return null;
    }
    return (

        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-600 p-6 rounded shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre producto</label>
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ingrese el nombre" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-black-900 dark:text-white">Precio</label>
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
                            <select id="lot" value={selectedLot?.external_id || ''} onChange={(e) => {
                                const selectedLotObj = lotsOptions.find(lot => lot.external_id === e.target.value);
                                setSelectedLot(selectedLotObj || null);
                            }}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                {lotsOptions.map((lot) => (
                                    <option key={lot.external_id} value={lot.external_id}>{lot.code}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Cargar Imagen</label>
                            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={handleFileChange} />
                            <p className="mt-1 text-sm text-gray-900 dark:text-white" id="file_input_help">PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                    </div>
                    {successMessage && (
                        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                                <span className="font-medium">{successMessage}</span> 
                            </div>
                        </div>
                    )}
                    <div className="flex space-x-4">
                        <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Add new product
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

export default CreateProduct;
