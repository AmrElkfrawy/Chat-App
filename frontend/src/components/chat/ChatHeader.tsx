import { XIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setSelectedUser]);

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/40">
      {/* Left — avatar + info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="avatar">
            <div className="w-10 rounded-full ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-slate-800">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
                className="object-cover"
              />
            </div>
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-800" />
        </div>

        <div>
          <h3 className="text-slate-100 font-medium text-sm leading-tight">
            {selectedUser?.fullName}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-400/80 text-xs">Online</p>
          </div>
        </div>
      </div>

      {/* Right — close */}
      <button
        onClick={() => setSelectedUser(null)}
        title="Close (Esc)"
        className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 active:scale-95 transition-all duration-150"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ChatHeader;
