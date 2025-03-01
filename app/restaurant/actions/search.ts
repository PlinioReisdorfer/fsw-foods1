"use server";

import { db } from "@/lib/prisma";

export const searchForRestaurant = async (search: string) => {
  const restaurant = await db.restaurant.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  return restaurant;
};
