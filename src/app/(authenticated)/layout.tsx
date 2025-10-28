"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { GetCurrentUserDocument } from "@/graphql/@generated/graphql";
import { useQuery } from "@apollo/client/react";
import { ReactNode, useEffect, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { setUser } = useAuth();
  const {data: dataUser} = useQuery(GetCurrentUserDocument);

  useEffect(() => {
     setUser(dataUser?.viewer);
  }, [dataUser, setUser]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="w-full">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col lg:ml-72.5">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
