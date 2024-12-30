"use client";
import React from "react";
import { socket } from "@/socket";
import { useUserStore } from "@/providers/user-store-provider";
import { redirect } from "next/navigation";
import clsx from "clsx";

export default function Room() {
  const { hasHydrated, userId, userName, setUserId } = useUserStore(
    (state) => state
  );

  const [isConnected, setIsConnected] = React.useState(false);
  const [transport, setTransport] = React.useState("N/A");
  const [roomId, setRoomId] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [enableReady, setEnableReady] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(false);

  const onConnect = () => {
    console.log("socket.id", socket.id);
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
    socket.emit("joinRandomRoom", userName);
  };

  const onRoomJoined = (
    userId: string,
    roomId: string,
    roomSize: number,
    gameSize: number
  ) => {
    console.log("onRoomJoined()");
    setUserId(userId);
    setRoomId(roomId);
    setMessages((prev) => [
      ...prev,
      `${roomId}번 방에 입장했습니다. 현재 인원: ${roomSize}/2.${
        roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
      }`,
    ]);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onOtherUserJoin = (
    userId: string,
    roomSize: number,
    gameSize: number
  ) => {
    setMessages((prev) => [
      ...prev,
      `${userId}님이 입장하셨습니다. 현재 인원: ${roomSize}/2.${
        roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
      }`,
    ]);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onChatSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.length > 0) {
      socket.emit("chat message", inputValue);
      setInputValue("");
      chatInputRef?.current?.focus();
    }
  };

  const onWelcomeMessage = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      chatWindowRef?.current?.scrollTo({
        top: chatWindowRef.current.scrollHeight,
      });
    }, 100);
  };

  const onGameStart = () => {
    alert("game start !!");
  };

  const onOtherUserLeave = (otherUserName: string, roomSize: number) => {
    console.log("onOtherUserLeave otherUserName", otherUserName);
    setMessages((prev) => [
      ...prev,
      `${otherUserName}님이 퇴장하셨습니다. 현재 인원: ${roomSize}/2.`,
    ]);
    setEnableReady(false);
    setReady(false);
  };

  const onSetReady = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReady(true);
    socket.emit("ready", roomId);
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setTransport("N/A");
  };

  React.useEffect(() => {
    // if (socket.connected) {
    //   onConnect();
    // }

    socket.on("connect", onConnect);
    socket.on("roomJoined", onRoomJoined);
    socket.on("welcome", onOtherUserJoin);
    socket.on("chat message", onWelcomeMessage);
    socket.on("game start", onGameStart);
    socket.on("leave", onOtherUserLeave);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("roomJoined", onRoomJoined);
      socket.off("welcome", onOtherUserJoin);
      socket.off("chat message", onWelcomeMessage);
      socket.off("game start", onGameStart);
      socket.off("leave", onOtherUserLeave);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const chatWindowRef = React.useRef<HTMLUListElement>(null);
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  } else {
    if (userName === "") {
      redirect("/");
    }
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col">
        <ul ref={chatWindowRef} className="flex-1 overflow-auto">
          {messages.map((m, _m) => {
            return <li key={`${roomId}_${m}_${_m}`}>{m}</li>;
          })}
        </ul>
        <form onSubmit={onChatSend}>
          <button
            disabled={!enableReady || ready}
            onClick={onSetReady}
            className={clsx(
              `${!enableReady ? "text-[grey]" : !ready ? "text-[red]" : ""}`
            )}
          >
            ready
          </button>
          <input
            ref={chatInputRef}
            id="chat"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div></div>
    </div>
  );
}
