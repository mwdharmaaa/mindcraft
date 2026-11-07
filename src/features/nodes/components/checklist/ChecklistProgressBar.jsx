const ChecklistProgressBar = ({ percent }) => {
  return <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2.5">
      <div
    className="h-full bg-zinc-200 transition-all duration-300 rounded-full"
    style={{ width: `${percent}%` }}
  />
    </div>;
};
export {
  ChecklistProgressBar
};
