/*
"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart, deleteAProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductActionButton({ product }) {
  const pathName = usePathname();
  const router = useRouter();
  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal,
    setShowCartModal
  } = useContext(GlobalContext);

  const isOnAdminPage = pathName.includes("admin-view");

  async function removeProduct(product) {
    setComponentLevelLoader({ loading: true, id: product._id });
    const response = await deleteAProduct(product._id);

    if (response.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      router.refresh();
    }
  }

  async function addItemToCart(product) {
    setComponentLevelLoader({ loading: true, id: product._id });
    const response = await addToCart({ productID: product._id, userID: user._id });

    if (response.success) {
      toast.success("Added to cart!");
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    } else {
      toast.error(response.message);
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    }
  }

  return isOnAdminPage ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(product);
          router.push("/admin-view/edit-product");
        }}
        className="mt-2 mb-2 flex w-full items-center justify-center bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-blue-600 transition-colors duration-300"
      >
        Edit
      </button>
      <button
        onClick={() => removeProduct(product)}
        className="mt-2 flex w-full items-center justify-center bg-red-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-red-600 transition-colors duration-300"
      >
        {componentLevelLoader.loading && componentLevelLoader.id === product._id ? (
          <ComponentLevelLoader
            text="Deleting..."
            color="#ffffff"
            loading={true}
          />
        ) : (
          "Delete"
        )}
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => addItemToCart(product)}
        className="mt-2 flex w-full items-center justify-center bg-green-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-green-600 transition-colors duration-300"
      >
        {componentLevelLoader.loading && componentLevelLoader.id === product._id ? (
          <ComponentLevelLoader
            text="Adding..."
            color="#ffffff"
            loading={true}
          />
        ) : (
          "Add to Cart"
        )}
      </button>
    </>
  );
}
*/

"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { deleteAProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";


export default function ProductButton({ item }) {
  const pathName = usePathname();
  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal, setShowCartModal
  } = useContext(GlobalContext);
  const router = useRouter();

  const isAdmin = pathName.includes("admin-view");

  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id });

    const res = await deleteAProduct(item._id);

    if (res.success) {
        setComponentLevelLoader({ loading: false, id: "" });

        router.refresh();

      }
    }

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });

    const res = await addToCart({ productID: getItem._id, userID: user._id });

    if (res.success) {
      toast.success(res.message, {
        // position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    } else {
      toast.error(res.message, {
        // position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true)
    }

    console.log(res);
  }

  return isAdmin ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className="mt-2 mb-2 flex w-full items-center justify-center bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-blue-600 transition-colors duration-300"
      >
        Update
      </button>
      <button
        onClick={() => handleDeleteProduct(item)}
        className="mt-2 flex w-full items-center justify-center bg-red-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-red-600 transition-colors duration-300"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting Product"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "DELETE"
        )}
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => handleAddToCart(item)}
        className="mt-2 flex w-full items-center justify-center bg-green-500 px-4 py-2 text-sm font-bold uppercase text-white rounded hover:bg-green-600 transition-colors duration-300"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={"Adding to cart"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "Add To Cart"
        )}
      </button>
    </>
  );
}