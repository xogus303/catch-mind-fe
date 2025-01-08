"use client";
import React from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { redirect } from "next/navigation";
import Chat from "./Chat";
import { socket } from "@/socket";
import { IUserListItem } from "@/types";

export default function Room() {
  const { hasHydrated, userName } = useUserStore((state) => state);

  const [userList, setUserList] = React.useState<IUserListItem[]>([]);
  console.log("userList", userList);

  const updateUserInfo = (list: IUserListItem[]) => {
    setUserList(list);
  };

  React.useEffect(() => {
    socket.on("user update", updateUserInfo);

    return () => {
      socket.off("user update", updateUserInfo);
    };
  }, []);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  } else {
    if (userName === "") {
      redirect("/");
    }
  }

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex-1">
        <div>
          {userList.map((u) => {
            return <div key={`user-${u.id}`}>{u.name}</div>;
          })}
        </div>
      </div>
      <div className="flex h-[30%] min-h-[250px]">
        <Chat />
      </div>
    </div>
  );
}
