import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../../auth/[...nextauth]/AuthOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user) {
    return NextResponse.json("Unauthorized access please login first", {
      status: 403,
    });
  }

  const { phone, id, credit, price, name } = await request.json();

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
}
