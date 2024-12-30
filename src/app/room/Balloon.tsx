import { IChatMessageItem } from "@/types";

interface IProps extends IChatMessageItem {}

const Balloon = (props: IProps) => {
  if (props.type === "my") {
    return (
      <div className="flex">
        <span className="inline-block py-[5px] px-[10px] rounded-[4px] bg-amber-200 text-slate-700 box-border">
          {props.message}
        </span>
      </div>
    );
  }
  if (props.type === "other") {
    return (
      <div className="flex justify-end">
        <span className="inline-block py-[5px] px-[10px] rounded-[4px] bg-indigo-50 text-slate-700 box-border">
          {props.message}
        </span>
      </div>
    );
  }
  return (
    <div className="flex bg-slate-100 justify-center rounded-[4px]">
      <span className="text-slate-700 text-[13px]">{props.message}</span>
    </div>
  );
};

export default Balloon;
