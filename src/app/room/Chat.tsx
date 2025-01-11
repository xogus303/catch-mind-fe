import { IChatMessageItem } from "@/types";
import React from "react";
import { socket } from "@/socket";
import { useUserStore } from "@/providers/user-store-provider";
import { koreaNewDate } from "@/utils";
import Balloon from "./Balloon";
import clsx from "clsx";

interface IChatProps {
  roomId: string;
}
const Chat = (props: IChatProps) => {
  const { userName } = useUserStore((state) => state);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [messages, setMessages] = React.useState<IChatMessageItem[]>([]);

  const onRoomJoined = (
    userId: string,
    roomId: string,
    roomSize: number,
    gameSize: number
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        message: `${roomId}번 방에 입장했습니다. 현재 인원: ${roomSize}/${gameSize}.${
          roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
        }`,
        time: new Date(),
      },
    ]);
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
        message: `${userName}님이 입장하셨습니다. 현재 인원: ${roomSize}/${gameSize}.${
          roomSize === gameSize ? " 준비완료 버튼을 눌러주세요." : ""
        }`,
        time: new Date(),
      },
    ]);
  };

  const onChatSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.length > 0) {
      socket.emit("chat message", props.roomId, inputValue, userName);
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

  const onOtherUserLeave = (
    otherUserName: string,
    roomSize: number,
    gameSize: number
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        message: `${otherUserName}님이 퇴장하셨습니다. 현재 인원: ${roomSize}/${gameSize}.`,
        time: new Date(),
      },
    ]);
  };

  React.useEffect(() => {
    socket.on("roomJoined", onRoomJoined);
    socket.on("welcome", onOtherUserJoin);
    socket.on("chat message", onChatMessage);
    socket.on("leave", onOtherUserLeave);

    return () => {
      socket.off("roomJoined", onRoomJoined);
      socket.off("welcome", onOtherUserJoin);
      socket.off("chat message", onChatMessage);
      socket.off("leave", onOtherUserLeave);
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
              key={`${props.roomId}_${m.type}_${m.message}_${_m}`}
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
        <button
          type="submit"
          className="px-[10px] text-[#ccc] text-[13px] bg-slate-600 hover:bg-slate-800 rounded-[4px]"
        >
          전송
        </button>
      </form>
    </div>
  );
};
export default Chat;
