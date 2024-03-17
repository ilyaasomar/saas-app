import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  let updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: {
      credit: Number(body.credit),
    },
  });

  return NextResponse.json("Updated successfully", { status: 200 });
}
