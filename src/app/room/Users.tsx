import React from "react";

import { socket } from "@/socket";
import { IUserListItem } from "@/types";

const Users = () => {
  const [userList, setUserList] = React.useState<IUserListItem[]>([]);

  const updateUserInfo = (list: IUserListItem[]) => {
    setUserList(list);
  };

  React.useEffect(() => {
    socket.on("user update", updateUserInfo);

    return () => {
      socket.off("user update", updateUserInfo);
    };
  }, []);

  return (
    <div className="flex flex-col py-[10px] w-[30%] border-r-[1px] gap-[0px]">
      {userList.map((u) => {
        return (
          <div key={`user-${u.id}`} className="flex flex-col items-center">
            <div className="flex w-[80%] h-[24px] justify-center items-center bg-slate-700 rounded-xl">
              <span className="text-[white] text-[13px]">{u.name}</span>
            </div>
            <div className="flex h-[50px] items-center">
              <strong>{u.answer}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Users;
