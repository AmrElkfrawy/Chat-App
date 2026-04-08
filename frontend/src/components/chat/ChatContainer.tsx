import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesWithUserId,
    messages,
    isMessagesLoading,
    subscribeToNewMessages,
    unsubscribeFromNewMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesWithUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesWithUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to new messages via socket
  useEffect(() => {
    if (selectedUser) {
      subscribeToNewMessages(() => {
        // Scroll to bottom when a new message arrives
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
    return () => {
      unsubscribeFromNewMessages();
    };
  }, [selectedUser, subscribeToNewMessages, unsubscribeFromNewMessages]);

  const isMe = (senderId: string) => senderId === authUser?._id;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-1">
            {messages.map((msg, i) => {
              const mine = isMe(msg.sender);
              const prevMine = i > 0 && isMe(messages[i - 1].sender);
              const grouped = mine === prevMine;

              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"} ${grouped ? "mt-0.5" : "mt-3"}`}
                >
                  {/* Avatar — only show on first in a group */}
                  {!mine && (
                    <div
                      className={`flex-shrink-0 ${grouped ? "invisible" : ""}`}
                    >
                      <img
                        src={selectedUser?.profilePic || "/avatar.png"}
                        className="w-6 h-6 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`flex flex-col gap-1 max-w-[70%] ${mine ? "items-end" : "items-start"}`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Sent image"
                        className="rounded-2xl max-w-full h-auto border border-slate-700/30"
                      />
                    )}
                    {msg.text && (
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed
                          ${
                            mine
                              ? "bg-cyan-500 text-white rounded-br-sm"
                              : "bg-slate-700/60 text-slate-100 rounded-bl-sm"
                          }`}
                      >
                        {msg.text}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
