import React from "react";

import { socket } from "@/socket";
import { IUserListItem } from "@/types";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

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
    <div className="flex flex-col w-[30%] min-w-[230px] max-w-[300px] border-r-[1px]">
      {userList.map((u) => {
        return (
          <div key={`user-${u.id}`} className="flex flex-col p-[10px]">
            <div className="flex gap-[5px]">
              <div className="px-[10px] h-[24px] bg-slate-700 rounded-xl">
                <span className="text-[white] text-[13px] ">{u.name}</span>
              </div>
              {u.type === "master" && (
                <div>
                  <CheckBadgeIcon className="size-6 text-blue-400" />
                </div>
              )}
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
