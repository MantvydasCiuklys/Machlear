import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, co2Saved, balance } = req.body;
  try {
    const wallet = await prisma.userWallet.create({
      data: {
        userId,
        co2Saved,
        balance,
      },
    });
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: "Unable to create wallet" });
  }
}
