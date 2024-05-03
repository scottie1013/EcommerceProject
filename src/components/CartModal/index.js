"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import CommonModal from "../CommonModal";

export default function ShoppingCartModal() {
  const {
    showCartModal,
    setShowCartModal,
    cartItems,
    setCartItems,
    user,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);
  const router = useRouter();

  async function retrieveCartItems() {
    const response = await getAllCartItems(user?._id);
    if (response.success) {
      const updatedItems = response.data.map((item) => ({
        ...item,
        productID: {
          ...item.productID,
          price: item.productID.onSale === "yes"
            ? parseFloat((item.productID.price - item.productID.price * (item.productID.priceDrop / 100)).toFixed(2))
            : item.productID.price,
        },
      }));
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  }

  useEffect(() => {
    if (user) retrieveCartItems();
  }, [user]);

  async function handleCartItemRemoval(cartItemId) {
    setComponentLevelLoader({ loading: true, id: cartItemId });
    const result = await deleteFromCart(cartItemId);

    if (result.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(result.message);
      retrieveCartItems();
    } else {
      toast.error(result.message);
      setComponentLevelLoader({ loading: false, id: cartItemId });
    }
  }

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems.length > 0 ? (
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-300">
                  <img
                    src={cartItem.productID.imageUrl}
                    alt="Product in Cart"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-gray-800">
                    <h3>{cartItem.productID.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ${cartItem.productID.price}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="text-red-600 font-medium"
                      onClick={() => handleCartItemRemoval(cartItem._id)}
                    >
                      {componentLevelLoader.loading && componentLevelLoader.id === cartItem._id ? (
                        <ComponentLevelLoader
                          text="Removing..."
                          color="#ffffff"
                          loading={true}
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )
      }
      buttonComponent={
        <div>
          <button
            type="button"
            onClick={() => {
              router.push("/cart");
              setShowCartModal(false);
            }}
            className="mt-1.5 mb-2 w-full bg-blue-500 text-white py-3 text-xs uppercase font-semibold tracking-wide rounded hover:bg-blue-600 transition duration-300"
          >
            View Cart
          </button>
          <button
            disabled={cartItems.length === 0}
            type="button"
            onClick={() => {
              router.push("/checkout");
              setShowCartModal(false);
            }}
            className="mb-2 w-full bg-green-500 text-white py-3 text-xs uppercase font-semibold tracking-wide rounded hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
          >
            Proceed to Checkout
          </button>
          <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
            <button type="button" className="font-medium text-indigo-600 hover:underline">
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </div>
      }
    />
  );
}


