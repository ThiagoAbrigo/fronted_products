import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error('Failed Connection');
}
const createHeaders = (token?:string) => {
    let headers: { [key: string]: string } = {
        "Accept": "application/json",
        "Content-type": "application/json"
    };

    if (token) {
        headers["X-Access-Token"] = token;
    }

    return headers;
};

const login = async (data: { email: string; password: string }, token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.post(`${apiUrl}/login`, data, { headers });
    return response.data;
};

const listProducts = async (token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/listproduct`, { headers });
    return Array.isArray(response.data.data) ? response.data.data : [];
};

const listLots = async (token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/lot`, { headers });
    return response.data.data
};

const listStatus = async (token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/list_status`, { headers });
    return response.data.data
};

const saveProduct = async (data: FormData, token = "NONE") => {
    const headers = {
        "Accept": "application/json",
        'Content-Type': 'multipart/form-data',
    };
    try{
        const response = await axios.post(`${apiUrl}/save/product`, data, {
            headers,
        });
        console.log(response);
    
        return response.data;
    }catch(error){
        console.error('Error al guardar el producto:', error);
        throw error; 
    }
};
const updateProductImage = async (externalId: string, image: File, token = "NONE") => {
    const headers = {
        "Accept": "application/json",
        'Content-Type': 'multipart/form-data',
    };
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post(`${apiUrl}/update/product/image/${externalId}`, formData, {headers});

        return response.data;
    } catch (error) {
        throw error;
    }
};
const modifyProduct = async (data:any, external_id:string, token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.post(`${apiUrl}/modify_product/${external_id}`, data, { headers });
    console.log(response);
    
    return response.data;
}
const listCaducados = async (token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/listproduct/caducados`, { headers });
    return response.data.data
}
const ListApuntodecaducar= async (token = "NONE") => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/listproduct/expired_5days`, { headers });
    return response.data.data
}
const listBuenos = async (token?:string) => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/listproduct/buenos`, { headers });
    return response.data.data
}
const listGalery = async (token?:string) => {
    const headers = createHeaders(token);
    const response = await axios.get(`${apiUrl}/listproduct/images`, { headers });
    return response.data.data
}

const api ={
    login,
    listProducts,
    listLots,
    listStatus,
    saveProduct,
    modifyProduct,
    listBuenos,
    listCaducados,
    ListApuntodecaducar,
    updateProductImage,
    listGalery,
}
export default api