import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAi from "openai";
import { AuthOptions } from "../../AuthOptions";
import prisma from "@/prisma/client";
import { uploadToAws } from "@/util/uploadToAws";
const OpenAI = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
    return NextResponse.json("Unauthorized access please login first", {
      status: 403,
    });
  }

  const user = session.user;

  const userInfo = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!userInfo) {
    return NextResponse.json("bad request", {
      status: 400,
    });
  }

  try {
    const { svg } = await request.json();
    if (!svg) {
      return NextResponse.json("image not provided", {
        status: 400,
      });
    }

    const userId = userInfo.id;

    const { presignedUrl, totalTokens, key } = await uploadToAws(svg, userId);

    if (userInfo.credit < totalTokens) {
      const additionalCreditRequired = totalTokens - userInfo.credit;
      return NextResponse.json(
        {
          message: "Insufficient credit . additional credit required",
          additionalCreditRequired,
          currentBalance: userInfo.credit,
        },
        {
          status: 402,
        }
      );
    }

    // openai
  } catch (error) {}
}
