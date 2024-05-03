"use client";

import { useRouter } from "next/navigation";

export default function ProductTile({ item }) {
  const router = useRouter();

  // Handle to navigate to the product detail page on click
  const goToProductPage = () => router.push(`/product/${item._id}`);

  return (
    <div onClick={goToProductPage}>
      <div className="overflow-hidden aspect-w-1 aspect-h-1 h-52">
        <img
          src={item.imageUrl}
          alt="Product image"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
        />
      </div>
      
      <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
        <div className="mb-2 flex">
          <p
            className={`mr-3 text-sm font-semibold ${item.onSale === "yes" ? "line-through" : ""}`}
          >
            {`$${item.price}`}
          </p>
          {item.onSale === "yes" && (
            <p className="text-sm font-semibold text-red-700">
              {`$${(item.price - item.price * (item.priceDrop / 100)).toFixed(2)}`}
            </p>
          )}
          {item.onSale === "yes" && (
            <p className="text-sm font-semibold">
            </p>
          )}
        </div>
        <h3 className="text-sm text-gray-400">{item.name}</h3>
      </div>
    </div>
  );
}
