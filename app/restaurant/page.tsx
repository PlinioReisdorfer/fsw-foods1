"use client";

import { notFound, useSearchParams } from "next/navigation";
import { Restaurant } from "@prisma/client";
import { useEffect, useState } from "react";
import { searchForRestaurant } from "./actions/search";
import Header from "@/components/ui/header";
import RestaurantItem from "@/components/ui/restaurant-item";

const Restaurant = () => {
  const searchParams = useSearchParams();
  const [restaurant, setRestaurants] = useState<Restaurant[]>([]);

  const searchFor = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchFor) return;
      const foundRestaurants = await searchForRestaurant(searchFor);
      setRestaurants(foundRestaurants);
    };

    fetchRestaurants();
  }, [searchFor]);

  if (!searchFor) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Encontrados</h2>
        <div className="flex w-full flex-col gap-6">
          {restaurant.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurant;
