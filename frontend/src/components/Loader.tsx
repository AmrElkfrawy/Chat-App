import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface LoaderProps {
  children?: ReactNode;
}

const Loader = ({ children = "Loading..." }: LoaderProps) => {
  return (
    <div className="relative flex flex-col items-center">
      <Loader2 className="size-12 text-cyan-400 animate-spin" />
      <h2 className="mt-4 text-lg font-medium bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
        {children}
      </h2>
    </div>
  );
};

export default Loader;
