import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ActiveTabSwitch from "../components/chat/ActiveTabSwitch";
import ChatContainer from "../components/chat/ChatContainer";
import ChatsList from "../components/chat/ChatsList";
import ContactList from "../components/chat/ContactList";
import NoConversionPlaceholder from "../components/chat/NoConversionPlaceholder";
import ProfileHeader from "../components/chat/ProfileHeader";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[93vh]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm w-240">
          {selectedUser ? <ChatContainer /> : <NoConversionPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
