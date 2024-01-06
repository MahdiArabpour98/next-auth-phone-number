import { signJwtAccessToken } from "@/libs/jwt";
import prismadb from "@/libs/prismadb";

export async function POST(request) {
  const body = await request.json();

  const user = await prismadb.user.findFirst({
    where: {
      phoneNumber: body.phoneNumber,
    },
  });

  if (user) {
    const accessToken = signJwtAccessToken(user);
    const result = {
      ...user,
      accessToken,
    };
    return new Response(JSON.stringify(result));
  } else return new Response(JSON.stringify(null));
}
