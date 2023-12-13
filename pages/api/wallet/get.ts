import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {UserWallet:true}
    });

    if (!user || !user) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve wallet data" });
  }
}
