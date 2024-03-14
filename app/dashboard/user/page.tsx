import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./(pages)/_components/Column";
import prisma from "@/prisma/client";
import NewCodeButton from "./(pages)/_components/NewCodeButton";
const UserPage = async () => {
  const data = await prisma.generatedCode.findMany();
  return (
    <div className="my-4 space-y-4 sm:p-6 lg:p-2">
      <NewCodeButton />
      {/* table */}
      <DataTable columns={columns} data={data} filter={"total_tokens"} />
    </div>
  );
};

export default UserPage;
