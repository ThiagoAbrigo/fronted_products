import { Product } from '@/app/models/product';
import { RefreshCcw } from 'react-feather';
import api from '@/app/api/api';
import { useState } from 'react';

interface ProductFormProps {
    show: boolean;
    onClose: () => void;
    product: Product | null;
}
const ChangeImage: React.FC<ProductFormProps> = ({ show, onClose, product }) => {
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };
    const handleUpdateImage = async () => {
        if (!product || !image) return;

        try {
            await api.updateProductImage(product.external_id, image);
            const updatedProducts = await api.listProducts(); // Aquí obtienes nuevamente la lista actualizada de productos
            onClose(); // Cierra el modal después de actualizar la imagen
            console.log('Imagen actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar la imagen:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-200 p-6 rounded shadow-lg">
                <form onSubmit={handleUpdateImage}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black" htmlFor="file_input">Cargar Imagen</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={handleImageChange} />
                        <p className="mt-1 text-sm text-gray-500 dark:text-black-300" id="file_input_help">PNG, JPG or GIF (MAX. 800x400px).</p>
                    </div>
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
export default ChangeImage