import { socket } from "@/socket";
import clsx from "clsx";
import React from "react";

const Controller = () => {
  const [roomId, setRoomId] = React.useState<string>("");
  const [enableReady, setEnableReady] = React.useState<boolean>(false);
  console.log("enableReady", enableReady);
  const [ready, setReady] = React.useState<boolean>(false);
  console.log("ready", ready);

  const onRoomJoined = (
    userId: string,
    roomId: string,
    roomSize: number,
    gameSize: number
  ) => {
    console.log("onRoomJoined() --------");
    console.log("roomSize", roomSize);
    console.log("gameSize", gameSize);
    setRoomId(roomId);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onOtherUserJoin = (
    userName: string,
    roomSize: number,
    gameSize: number
  ) => {
    console.log("onOtherUserJoin()");
    console.log("roomSize", roomSize);
    console.log("gameSize", gameSize);
    if (roomSize === gameSize) {
      setEnableReady(true);
    }
  };

  const onOtherUserLeave = (otherUserName: string) => {
    console.log("onOtherUserLeave otherUserName --------", otherUserName);
    setEnableReady(false);
    setReady(false);
  };

  const onSetReady = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReady(true);
    socket.emit("ready", roomId);
  };

  React.useEffect(() => {
    socket.on("roomJoined", onRoomJoined);
    socket.on("welcome", onOtherUserJoin);
    socket.on("leave", onOtherUserLeave);

    return () => {
      socket.off("roomJoined", onRoomJoined);
      socket.off("welcome", onOtherUserJoin);
      socket.off("leave", onOtherUserLeave);
    };
  }, []);

  return (
    <div className="flex flex-col p-[10px] w-[200px]">
      <div className="flex-1"></div>
      <button
        type={"button"}
        disabled={!enableReady || ready}
        onClick={onSetReady}
        className={clsx(
          `py-[10px] px-[20px] rounded-full ${
            !enableReady
              ? "text-[#ccc] bg-slate-600"
              : !ready
              ? "text-[white] bg-red-400"
              : ""
          }`
        )}
      >
        준비하기
      </button>
    </div>
  );
};

export default Controller;
