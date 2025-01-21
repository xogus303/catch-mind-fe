const Loader = () => {
  return (
    <div className="w-[48px] h-[48px] border-[3px] border-slate-600 rounded-[50%] inline-block relative animate-spin">
      <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[40px] h-[40px] rounded-[50%] border-[3px] border-white border-b-blue-400" />
    </div>
  );
};

export default Loader;
