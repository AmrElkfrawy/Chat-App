import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UserSearchIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

function ContactList() {
  const { onlineUsers } = useAuthStore();
  const {
    getAllContacts,
    allContacts,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 mt-20 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
          <UserSearchIcon className="size-5 text-slate-400" />
        </div>
        <h4 className="text-slate-200 font-medium text-sm">No contacts yet</h4>
        <p className="text-slate-500 text-xs leading-relaxed">
          Other users will appear here once they join. Start a conversation
          whenever you're ready.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {allContacts.map((contact, i) => (
        <button
          key={contact._id}
          onClick={() => setSelectedUser(contact)}
          style={{ animationDelay: `${i * 40}ms` }}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            hover:bg-slate-700/40 active:bg-slate-700/60
            transition-all duration-150 text-left
            animate-[fadeSlideIn_0.3s_ease_both] ${selectedUser?._id === contact._id ? "bg-slate-700/60" : ""}`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`avatar ${onlineUsers.includes(contact._id) ? "avatar-online" : "avatar-offline"}`}
            >
              <div className="size-10 rounded-full ring-1 ring-slate-700/50 group-hover:ring-cyan-500/30 transition-all">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
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
              {contact.fullName}
            </p>
            <p className="text-slate-500 text-xs">Tap to message</p>
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

export default ContactList;
