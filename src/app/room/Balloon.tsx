import { IChatMessageItem } from "@/types";

interface IProps extends IChatMessageItem {}

const Balloon = (props: IProps) => {
  if (props.type === "my") {
    return (
      <div className="flex max-w-[90%] items-end gap-[5px]">
        <span className="flex py-[5px] px-[10px] rounded-[4px] bg-amber-200 text-slate-700 box-border">
          {props.message}
        </span>
        {props.isLastSameMin && (
          <span className="text-[14px] text-neutral-500">
            {props.time.toISOString().slice(11, 16)}
          </span>
        )}
      </div>
    );
  }
  if (props.type === "other") {
    return (
      <div className="flex max-w-[90%] justify-end items-end gap-[5px]">
        {props.isLastSameMin && (
          <span className="text-[14px] text-neutral-500">
            {props.time.toISOString().slice(11, 16)}
          </span>
        )}
        <span className="inline-block py-[5px] px-[10px] rounded-[4px] bg-indigo-50 text-slate-700 box-border">
          {props.message}
        </span>
      </div>
    );
  }
  return (
    <div className="flex bg-slate-100 justify-center rounded-[4px]">
      <span className="text-slate-700 text-[13px]">{props.message}ㅇㅈ</span>
    </div>
  );
};

export default Balloon;
