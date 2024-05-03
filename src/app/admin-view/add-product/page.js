
'use client';

import InputComponent from "@/components/FormElements/inputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import { toast } from "react-toastify";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
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
const firebaseStorage = getStorage(firebaseApp, firebaseStorageURL);

const generateFileName = (file) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).slice(2, 12);
    return `${file.name}-${timestamp}-${randomString}`;
};

async function uploadFileToFirebase(file) {
    console.log("Uploading file:", file)
    const filename = generateFileName(file);
    const fileRef = ref(firebaseStorage, `ecommerce/${filename}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
                console.error('Failed to upload', error);
                reject(error);
            },
            async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

const defaultFormData = {
    name: "",
    price: 0,
    category: "men",
    sizes: [],
    imageUrl: "",
};

export default function ProductManager() {
    const [productData, setProductData] = useState(defaultFormData);
    const router = useRouter();
    const { componentLevelLoader, setComponentLevelLoader, currentUpdatedProduct } = useContext(GlobalContext);

    useEffect(() => {
        if (currentUpdatedProduct) {
            setProductData(currentUpdatedProduct);
        }
    }, [currentUpdatedProduct]);

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = await uploadFileToFirebase(file);
            console.log("Download URL:", imageUrl);
            setProductData({...productData, imageUrl});
        }
    }

    function toggleSizeSelection(selectedSize) {
        const updatedSizes = productData.sizes.includes(selectedSize)
            ? productData.sizes.filter(size => size !== selectedSize)
            : [...productData.sizes, selectedSize];
        setProductData({...productData, sizes: updatedSizes});
    }

    async function submitProduct() {
        setComponentLevelLoader(true);
        const response = currentUpdatedProduct
            ? await updateAProduct(productData)
            : await addNewProduct(productData);

        if (response.success) {
            toast.success('Product processed successfully!');
            router.push('/admin-view/all-products');
            setComponentLevelLoader(false);
            setProductData(defaultFormData);
        } else {
            toast.error(response.message);
            setComponentLevelLoader(false);
        }
    }

    return (
        <div className="bg-white shadow-2xl rounded-xl p-10 m-5">
            <div className="space-y-8">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <div>
                    <label>Sizes Available:</label>
                    <TileComponent selected={productData.sizes} onClick={toggleSizeSelection} data={AvailableSizes} />
                </div>
                {adminAddProductformControls.map(control => (
                    control.componentType === "input" ? (
                        <InputComponent
                            key={control.id}
                            {...control}
                            value={productData[control.id]}
                            onChange={(e) => setProductData({...productData, [control.id]: e.target.value})}
                        />
                    ) : (
                        <SelectComponent
                            key={control.id}
                            {...control}
                            value={productData[control.id]}
                            onChange={(e) => setProductData({...productData, [control.id]: e.target.value})}
                        />
                    )
                ))}
                <button
                    onClick={submitProduct}
                    className="w-full bg-black text-white uppercase font-medium px-6 py-4"
                >
                    {componentLevelLoader ? <ComponentLevelLoader text="Processing..." color="#ffffff" /> : (currentUpdatedProduct ? "Update Product" : "Add Product")}
                </button>
            </div>
        </div>
    );
}

