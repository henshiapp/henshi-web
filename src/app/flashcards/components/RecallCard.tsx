import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

type RecallCardProps = {
  text: string;
  side: "FRONT" | "BACK";
  isLoading: boolean;
};

export function RecallCard({ text, side, isLoading }: RecallCardProps) {
  return (
    <div
      className={
        (side === "BACK" ? "[transform:rotateY(180deg)] " : "") +
        (isLoading ? "flex justify-center items-center " : "") +
        "absolute inset-0 h-full w-full p-3 bg-slate-800 border-1 border-slate-700 rounded-xl text-center [backface-visibility:hidden] overflow-y-scroll"
      }
    >
      {isLoading ? <LoadingSpinner /> : text}
    </div>
  );
}
