import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../../auth/[...nextauth]/AuthOptions";
import axios from "axios";
import prisma from "@/prisma/client";
export async function POST(request: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
    return NextResponse.json("Unauthorized access please login first", {
      status: 403,
    });
  }

  const { phone, id, credits, price, name } = await request.json();

  const body = {
    schemaVersion: "1.0",
    requestId: "10111331033",
    timestamp: Date.now(),
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: process.env.MERCHANT_U_ID,
      apiUserId: process.env.MERCHANT_API_USER_ID,
      apiKey: process.env.MERCHANT_API_KEY,
      paymentMethod: "mwallet_account",
      payerInfo: {
        accountNo: phone,
      },
      transactionInfo: {
        referenceId: "1234",
        invoiceId: "7896504",
        amount: price,
        currency: "USD",
        description: name,
      },
    },
  };

  try {
    const response = await axios.post(
      process.env.MERCHANT_API_END_POINT!,
      body
    );
    const message = response.data.responseMsg;

    // RCS_SUCCESS

    if (message === "RCS_SUCCESS") {
      const userEmail = session.user.email;

      const userInfo = await prisma.user.findUnique({
        where: { email: userEmail! },
      });

      const creditIncrement = Number(credits);

      try {
        await prisma.user.update({
          where: { email: userEmail! },
          data: { credit: (userInfo?.credit ?? 0) + creditIncrement },
        });
      } catch (error) {
        console.log("error updating user credit", error)
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      return NextResponse.json(
        { ok: true },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(response.data.params.description, { status: 400 });
    }
  } catch (error) {
    console.log("error at local payment request", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
