import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <AiOutlineLoading3Quarters className="text-xl text-zinc-800 animate-spin" />
        <p className="kanit-regular text-lg text-zinc-800">Loading</p>
      </div>
    </>
  );
}
