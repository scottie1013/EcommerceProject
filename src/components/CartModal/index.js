"use client";

import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentlevel";
import { useRouter } from "next/navigation";

export default function CartModal() {
  const {
    showCartModal,
    setShowCartModal,
    cartItems,
    setCartItems,
    user,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  const navigation = useRouter();

  async function fetchCartItems() {
    const response = await getAllCartItems(user?._id);
    if (response.success) {
      const formattedItems = response.data.map((item) => ({
        ...item,
        productID: {
          ...item.productID,
          price: item.productID.onSale === "yes"
            ? parseFloat((item.productID.price - item.productID.price * (item.productID.priceDrop / 100)).toFixed(2))
            : item.productID.price,
        },
      }));
      setCartItems(formattedItems);
      localStorage.setItem("cartItems", JSON.stringify(formattedItems));
    }
    console.log(response);
  }

  useEffect(() => {
    if (user) fetchCartItems();
  }, [user]);

  async function removeCartItem(cartItemId) {
    setComponentLevelLoader({ loading: true, id: cartItemId });
    const result = await deleteFromCart(cartItemId);

    if (result.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(result.message);
      fetchCartItems();
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
          <ul role="list" className="-my-6 divide-y divide-gray-300">
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={cartItem.productID.imageUrl}
                    alt="Cart Item"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{cartItem.productID.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      ${cartItem.productID.price}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="font-medium text-yellow-600 sm:order-2"
                      onClick={() => removeCartItem(cartItem._id)}
                    >
                      {componentLevelLoader.loading && componentLevelLoader.id === cartItem._id ? (
                        <ComponentLevelLoader
                          text={"Removing"}
                          color={"#000000"}
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
        ) : null
      }
      buttonComponent={
        <Fragment>
          <button
            type="button"
            onClick={() => {
              navigation.push("/cart");
              setShowCartModal(false);
            }}
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
          >
            Go To Cart
          </button>
          <button
            disabled={cartItems.length === 0}
            type="button"
            onClick={() => {
              navigation.push("/checkout");
              setShowCartModal(false);
            }}
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
          >
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button type="button" className="font-medium text-grey">
              Continue 
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
}
