import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { logout } = useAuthStore();

  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default ChatPage;
