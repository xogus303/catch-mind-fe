import Loader from "@/components/Loader";
import { useUserStore } from "@/providers/user-store-provider";
import { socket } from "@/socket";
import clsx from "clsx";
import React from "react";

interface IControllerProps {
  roomId: string;
}

const Controller = (props: IControllerProps) => {
  const { userType } = useUserStore((state) => state);

  const [enableReady, setEnableReady] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(false);
  const [masterName, setMasterName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [started, setStarted] = React.useState<boolean>(false);
  const [word, setWord] = React.useState<string | null>(null);
  const [answerInputValue, setAnswerInputValue] = React.useState<string>("");

  const answerInputRef = React.useRef<HTMLInputElement>(null);

  const onRoomJoined = (
    userId: string,
    roomId: string,
    roomSize: number,
    gameSize: number
  ) => {
    console.log("onRoomJoined() --------");
    console.log("roomSize", roomSize);
    console.log("gameSize", gameSize);
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
    if (otherUserName === masterName) {
      setMasterName(null);
    }
  };

  const onSetReady = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReady(true);
    socket.emit("ready", props.roomId);
  };

  const updateMasterUser = (isMaster: string | null) => {
    setMasterName(isMaster);
  };

  const onLoadingStart = () => {
    console.log("onLoadingStart()");
    setIsLoading(true);
    // setStarted(true);
  };

  const onGameStart = (word: string) => {
    console.log("onGameStart word", word);
    setIsLoading(false);
    setStarted(true);
    if (userType === "master") {
      setWord(word);
    } else {
      setTimeout(() => {
        answerInputRef?.current?.focus();
      }, 300);
    }
  };

  const onSubmitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("answerInputValue", answerInputValue);
    setAnswerInputValue("");
  };

  React.useEffect(() => {
    socket.on("roomJoined", onRoomJoined);
    socket.on("welcome", onOtherUserJoin);
    socket.on("update master user", updateMasterUser);
    socket.on("loading start", onLoadingStart);
    socket.on("game start", onGameStart);
    socket.on("leave", onOtherUserLeave);

    return () => {
      socket.off("roomJoined", onRoomJoined);
      socket.off("welcome", onOtherUserJoin);
      socket.on("update master user", updateMasterUser);
      socket.off("loading start", onLoadingStart);
      socket.off("game start", onGameStart);
      socket.off("leave", onOtherUserLeave);
    };
  }, []);

  return (
    <div className="flex flex-col p-[10px] w-[200px] justify-end ">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!started ? (
            <div className="flex  flex-col gap-[10px]">
              <button
                type={"button"}
                disabled={!enableReady || ready}
                onClick={onSetReady}
                className={clsx(
                  `py-[10px] px-[20px] rounded-full ${
                    !enableReady
                      ? "text-[#ccc] bg-neutral-700"
                      : !ready
                      ? "text-[white] bg-red-400 hover:bg-red-600"
                      : ""
                  }`
                )}
              >
                {ready ? "준비완료" : "준비하기"}
              </button>
            </div>
          ) : (
            <>
              {userType === "master" ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-[10px]">
                    <span className="text-[14px] text-slate-500">
                      제출 단어
                    </span>
                    <strong className="text-[28px]">{word}</strong>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1  ">
                  <form
                    onSubmit={onSubmitAnswer}
                    className="flex flex-1 flex-col gap-[10px]"
                  >
                    <input
                      ref={answerInputRef}
                      placeholder="단어 입력"
                      value={answerInputValue}
                      onChange={(e) => setAnswerInputValue(e.target.value)}
                      maxLength={8}
                      className="flex flex-1 text-center  outline-none"
                    />
                    <button
                      type="submit"
                      className="h-[50px] text-[14px] font-bold text-white tracking-widest border-[1px] rounded-[4px] bg-blue-400 hover:bg-blue-500"
                    >
                      제출하기
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Controller;
