import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfilePic, isUpdatingProfile, onlineUsers } =
    useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("profilePic", file);

    updateProfilePic(data);
  };

  return (
    <div className="px-4 py-3 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* Left — Avatar + User Info */}
        <div className="flex items-center gap-3">
          <div
            className={`avatar ${onlineUsers.includes(authUser?._id) ? "avatar-online" : "avatar-offline"}`}
          >
            {/*  */}
            <div
              className="w-10 rounded-full overflow-hidden cursor-pointer relative"
              onClick={() =>
                !isUpdatingProfile && fileInputRef.current?.click()
              }
            >
              <img
                src={selectedImage || authUser?.profilePic || "/avatar.png"}
              />

              {isUpdatingProfile ? (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              )}
            </div>
            {/*  */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </div>

          <div>
            <h3 className="text-slate-200 font-medium text-sm max-w-[160px] truncate leading-tight">
              {authUser?.fullName}
            </h3>
            <p className="text-slate-400 text-xs">
              {onlineUsers.includes(authUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right — Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((err) => console.error("Sound play failed:", err));
              toggleSound();
            }}
            className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            title={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4" />
            ) : (
              <VolumeOffIcon className="size-4" />
            )}
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
            title="Log out"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
