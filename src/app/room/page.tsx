"use client";
import React from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { redirect } from "next/navigation";
import Chat from "./Chat";
import Users from "./Users";
import Controller from "./Controller";

export default function Room() {
  const { hasHydrated, userName } = useUserStore((state) => state);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  } else {
    if (userName === "") {
      redirect("/");
    }
  }

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex flex-1">
        <Users />
      </div>
      <div className="flex h-[30%] min-h-[250px] border-t-[10px] border-t-slate-300">
        <Chat />
        <Controller />
      </div>
    </div>
  );
}
