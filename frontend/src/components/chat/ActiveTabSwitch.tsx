import { useChatStore } from "../../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-1 p-2 m-2 bg-slate-700/30 rounded-lg">
      <button
        className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
        onClick={() => setActiveTab("chats")}
      >
        Chats
      </button>
      <button
        className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
        onClick={() => setActiveTab("contacts")}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
