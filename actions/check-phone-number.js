"use server";

import prismadb from "@/libs/prismadb";

export async function CheckPhoneNumber(phoneNumber) {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!user) {
      const newUser = await prismadb.user.create({
        data: {
          phoneNumber,
        },
      });

      if (newUser) return newUser;
    }

    return user;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}
