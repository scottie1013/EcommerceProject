"use client";

import InputComponent from "@/components/FormElements/inputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import { toast } from "react-toastify";
import { addNewProduct, updateAProduct } from "@/services/product";
import { GlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
    AvailableSizes,
    adminAddProductformControls,
    firebaseConfig,
    firebaseStorageURL,
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp, firebaseStorageURL);

const createFileName = (file) => {
    const time = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${file.name}-${time}-${randomPart}`;
};

async function uploadImageToFirebase(file) {
    const fileName = createFileName(file);
    const storageRef = ref(storage, `products/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.error('Upload failed:', error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

const initialProductDetails = {
    name: "",
    price: "",
    category: "men",
    sizes: [],
    imageUrl: "",
};

export default function ProductEditor() {
    const [productDetails, setProductDetails] = useState(initialProductDetails);
    const router = useRouter();
    const { currentUpdatedProduct } = useContext(GlobalContext);

    useEffect(() => {
        if (currentUpdatedProduct) {
            setProductDetails(currentUpdatedProduct);
        }
    }, [currentUpdatedProduct]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = await uploadImageToFirebase(file);
            setProductDetails({ ...productDetails, imageUrl });
        }
    };

    const handleSizeChange = (size) => {
        const updatedSizes = productDetails.sizes.includes(size)
            ? productDetails.sizes.filter(size => size !== size)
            : [...productDetails.sizes, size];
        setProductDetails({ ...productDetails, sizes: updatedSizes });
    };

    const saveProduct = async () => {
        const response = currentUpdatedProduct
            ? await updateAProduct(productDetails)
            : await addNewProduct(productDetails);

        if (response.success) {
            toast.success('Product saved successfully!');
            router.push('/admin-view/products');
            setProductDetails(initialProductDetails);
        } else {
            toast.error('Error saving product: ' + response.message);
        }
    };

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
            <h1 className="text-xl text-black font-bold mb-5">{currentUpdatedProduct ? "Edit Product" : "Add New Product"}</h1>
            <div className="space-y-6">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 text-black file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                {adminAddProductformControls.map(control => (
                    control.componentType === "input" ? (
                        <InputComponent
                            key={control.id}
                            {...control}
                            value={productDetails[control.id]}
                            onChange={(e) => setProductDetails({...productDetails, [control.id]: e.target.value})}
                        />
                    ) : (
                        <SelectComponent
                            key={control.id}
                            {...control}
                            value={productDetails[control.id]}
                            onChange={(e) => setProductDetails({...productDetails, [control.id]: e.target.value})}
                        />
                    )
                ))}
                <div>
                    <label className="block mb-2  text-sm font-medium text-gray-900">Select Sizes:</label>
                    <TileComponent selected={productDetails.sizes} onClick={handleSizeChange} data={AvailableSizes} />
                </div>
                <button
                    onClick={saveProduct}
                    className="w-full bg-blue-600 text-black py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    {currentUpdatedProduct ? "Update Product" : "Add Product"}
                </button>
            </div>
        </div>
    );
}
