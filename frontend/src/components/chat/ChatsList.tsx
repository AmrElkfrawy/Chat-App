import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="flex flex-col gap-0.5">
      {chats.map((chat, i) => (
        <button
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          style={{ animationDelay: `${i * 40}ms` }}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            hover:bg-slate-700/40 active:bg-slate-700/60
            transition-all duration-150 text-left
            animate-[fadeSlideIn_0.3s_ease_both] ${selectedUser?._id === chat._id ? "bg-slate-700/60" : ""}`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="avatar avatar-online">
              <div className="size-10 rounded-full ring-1 ring-slate-700/50 group-hover:ring-cyan-500/30 transition-all">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-slate-200 text-sm font-medium truncate
              group-hover:text-cyan-300 transition-colors duration-150"
            >
              {chat.fullName}
            </p>
            <p className="text-slate-500 text-xs truncate">
              {chat.lastMessage ?? "Tap to message"}
            </p>
          </div>

          {/* Arrow hint */}
          <span
            className="text-slate-600 text-xs opacity-0 group-hover:opacity-100
            group-hover:translate-x-0.5 transition-all duration-150 select-none"
          >
            →
          </span>
        </button>
      ))}
    </div>
  );
}

export default ChatsList;
