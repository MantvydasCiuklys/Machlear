import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

export default function Card({
  demo
}: {
  demo: ReactNode;
}) {
  return (
    <div
      className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md`}
    >
      <div className="flex items-center justify-center">{demo}</div>

    </div>
  );
}
