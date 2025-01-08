import { IChatMessageItem } from "@/types";
import React from "react";
import { redirect } from "next/navigation";
import { socket } from "@/socket";
import { useUserStore } from "@/providers/user-store-provider";
import { koreaNewDate } from "@/utils";
import Balloon from "./Balloon";
import clsx from "clsx";

const Chat = () => {
  const { hasHydrated, userName, setUserId } = useUserStore((state) => state);

  const [isConnected, setIsConnected] = React.useState(false);
  const [transport, setTransport] = React.useState("N/A");
  const [roomId, setRoomId] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");
  const [messages, setMessages] = React.useState<IChatMessageItem[]>([]);
  const [enableReady, setEnableReady] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(false);

  const onConnect = () => {
    console.log("onConnect socket.id", socket.id, userName);
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
    socket.emit("joinRandomRoom", userName);
  };

  const onConnectError = () => {
    alert("접속에 실패하였습니다.");
    redirect("/");
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
      {
        type: "system",
        message: `${roomId}번 방에 입장했습니다. 현재 인원: ${roomSize}/2.${
          roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
        }`,
        time: new Date(),
      },
    ]);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onOtherUserJoin = (
    userName: string,
    roomSize: number,
    gameSize: number
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        message: `${userName}님이 입장하셨습니다. 현재 인원: ${roomSize}/2.${
          roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
        }`,
        time: new Date(),
      },
    ]);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onChatSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.length > 0) {
      socket.emit("chat message", inputValue, userName);
      setInputValue("");
      chatInputRef?.current?.focus();
    }
  };

  const onChatMessage = (msg: string, id: string, name: string) => {
    const type = id === socket.id ? "my" : "other";
    setMessages((prev) => {
      let formatPrev = [...prev];
      let isFirstSameMin = true;
      if (prev.length > 0 && prev[prev.length - 1].id === id) {
        isFirstSameMin = false;
        const lastMessageTimeToString = prev[prev.length - 1].time
          .toISOString()
          .slice(0, 16);
        const nowTimeToString = koreaNewDate().toISOString().slice(0, 16);
        if (lastMessageTimeToString === nowTimeToString) {
          const lastMsg = {
            ...formatPrev.splice(formatPrev.length - 1, 1)[0],
            isLastSameMin: false,
          };
          formatPrev = [...formatPrev, lastMsg];
        } else {
          isFirstSameMin = true;
        }
      }
      return [
        ...formatPrev,
        {
          type,
          id,
          name,
          message: msg,
          time: koreaNewDate(),
          isFirstSameMin,
          isLastSameMin: true,
        },
      ];
    });
  };

  const onGameStart = () => {
    alert("game start !!");
  };

  const onOtherUserLeave = (otherUserName: string, roomSize: number) => {
    console.log("onOtherUserLeave otherUserName", otherUserName);
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        message: `${otherUserName}님이 퇴장하셨습니다. 현재 인원: ${roomSize}/2.`,
        time: new Date(),
      },
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
    if (socket.connected && hasHydrated && userName !== null) {
      onConnect();
    }
  }, [hasHydrated]);

  React.useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("roomJoined", onRoomJoined);
    socket.on("welcome", onOtherUserJoin);
    socket.on("chat message", onChatMessage);
    socket.on("game start", onGameStart);
    socket.on("leave", onOtherUserLeave);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("roomJoined", onRoomJoined);
      socket.off("welcome", onOtherUserJoin);
      socket.off("chat message", onChatMessage);
      socket.off("game start", onGameStart);
      socket.off("leave", onOtherUserLeave);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const chatWindowRef = React.useRef<HTMLUListElement>(null);
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (chatWindowRef.current) {
      setTimeout(() => {
        chatWindowRef?.current?.scrollTo({
          top: chatWindowRef.current.scrollHeight,
        });
      }, 100);
    }
  }, [chatWindowRef, messages]);
  return (
    <div className="flex flex-1 flex-col w-full bg-slate-200">
      <ul
        ref={chatWindowRef}
        className="flex flex-col flex-1 p-[10px] overflow-y-auto gap-[10px]"
      >
        {messages.map((m, _m) => {
          return (
            <li
              key={`${roomId}_${m.type}_${m.message}_${_m}`}
              className={clsx(
                `w-full ${m.type === "other" && "flex justify-end"}`
              )}
            >
              <Balloon {...m} />
            </li>
          );
        })}
      </ul>
      <form onSubmit={onChatSend} className="flex p-[10px] gap-[10px]">
        <input
          ref={chatInputRef}
          id="chat"
          placeholder="메시지 입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex flex-1 rounded-[4px] p-[5px]"
        />
        <button type="submit">Send</button>
        <button
          type={"button"}
          disabled={!enableReady || ready}
          onClick={onSetReady}
          className={clsx(
            `${!enableReady ? "text-[grey]" : !ready ? "text-[red]" : ""}`
          )}
        >
          ready
        </button>
      </form>
    </div>
  );
};
export default Chat;
