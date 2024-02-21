import { getServerSession } from "next-auth";
import { AuthOptions } from "./api/auth/[...nextauth]/AuthOptions";

export default async function Home() {
  const session = await getServerSession(AuthOptions);
  console.log(session);
  return <main>Hello {session?.user?.name}</main>;
}
