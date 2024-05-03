"use client";

import CommonCart from "@/components/CommonCart";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Cart() {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllCartItems() {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);
    if (res.success) {
      const updatedCartItems = res.data.map(item => ({
        ...item,
        productID: {
          ...item.productID,
          price: item.productID.onSale === "yes"
            ? parseInt(
                (
                  item.productID.price -
                  item.productID.price * (item.productID.priceDrop / 100)
                ).toFixed(2)
              )
            : item.productID.price,
        },
      }));
      setCartItems(updatedCartItems);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
    console.log(res);
  }

  useEffect(() => {
    if (user) extractAllCartItems();
  }, [user]);

  async function handleDeleteCartItem(getCartItemID) {
    setComponentLevelLoader({ loading: true, id: getCartItemID });
    const res = await deleteFromCart(getCartItemID);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message);
      extractAllCartItems();
    } else {
      toast.error(res.message);
      setComponentLevelLoader({ loading: false, id: getCartItemID });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader color={"#000000"} loading={pageLevelLoader} size={30} data-testid="loader" />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-1 p-4">
        <CommonCart
          componentLevelLoader={componentLevelLoader}
          handleDeleteCartItem={handleDeleteCartItem}
          cartItems={cartItems}
        />
      </div>
      <div className="w-1/4 bg-black-100 p-4 shadow-md">
        <h2 className="font-bold text-lg">Cart Summary</h2>
        <ul>
          {cartItems.map(item => (
            <li key={item.productID._id} className="my-2 p-2 border-b">
              {item.productID.name} - ${item.productID.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
