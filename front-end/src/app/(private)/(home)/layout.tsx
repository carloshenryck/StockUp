import { fetchServer } from "@/lib/fetchServer";
import { User } from "@/types/user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await fetchServer<User>("/profile");

  if (!user?.companyId) {
    redirect("/join-company");
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
