import { cn, formatDateShort, formatTime } from "@/lib/utils";
import { User } from "@shared/schema";

interface Chat {
  id: number;
  storeManagerId: number;
  lastMessageTime: string;
  unreadCount: number;
  storeManager?: {
    id: number;
    username: string;
    profileImage: string;
    storeId: number;
  };
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

const ChatList = ({ chats, selectedChatId, onSelectChat }: ChatListProps) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input 
          type="text" 
          className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0094D6] focus:border-transparent" 
          placeholder="Search store managers..."
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute left-3 top-3 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {chats.map((chat) => (
        <div 
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={cn(
            "flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer",
            selectedChatId === chat.id && "bg-gray-50",
            chat.unreadCount > 0 && "border-l-4 border-[#EF4444]"
          )}
        >
          <img 
            src={chat.storeManager?.profileImage || `https://randomuser.me/api/portraits/men/${chat.storeManagerId}.jpg`}
            alt="Store Manager" 
            className="w-10 h-10 rounded-full mr-3" 
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-800">
                {chat.storeManager?.username || `Manager ${chat.storeManagerId}`}
              </h4>
              <span className="text-xs text-gray-500">
                {formatTime(new Date(chat.lastMessageTime))}
              </span>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 truncate">
                Store #{chat.storeManager?.storeId || "Unknown"}
              </p>
              {chat.unreadCount > 0 && (
                <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
