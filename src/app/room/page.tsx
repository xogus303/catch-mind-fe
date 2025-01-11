"use client";
import React from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { redirect } from "next/navigation";
import Chat from "./Chat";
import Users from "./Users";
import Controller from "./Controller";
import { socket } from "@/socket";

export default function Room() {
  const { hasHydrated, userName, userType, setUserId } = useUserStore(
    (state) => state
  );

  const [isConnected, setIsConnected] = React.useState(false);
  const [transport, setTransport] = React.useState("N/A");
  const [roomId, setRoomId] = React.useState<string>("");

  const onConnect = () => {
    // console.log("onConnect socket.id", socket.id, userName);
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
    console.log("userType", userType);
    socket.emit("joinRandomRoom", userName, userType);
  };

  const onConnectError = (err) => {
    console.log("onConnectError err", err);
    alert("접속에 실패하였습니다.");
    redirect("/");
  };

  const onRoomJoined = (
    userId: string,
    roomId: string,
    roomSize: number,
    gameSize: number
  ) => {
    // console.log("onRoomJoined()");
    setUserId(userId);
    setRoomId(roomId);
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setTransport("N/A");
  };

  React.useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("roomJoined", onRoomJoined);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("roomJoined", onRoomJoined);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  React.useEffect(() => {
    if (socket.connected && hasHydrated && userName !== null) {
      onConnect();
    }
  }, [hasHydrated]);

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
        <Chat roomId={roomId} />
        <Controller roomId={roomId} />
      </div>
    </div>
  );
}
