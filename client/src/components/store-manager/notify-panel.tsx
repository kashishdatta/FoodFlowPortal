import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/lib/utils";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Mock data for communications chart
const communicationData = [
  { day: 'Mon', messages: 12 },
  { day: 'Tue', messages: 19 },
  { day: 'Wed', messages: 8 },
  { day: 'Thu', messages: 14 },
  { day: 'Fri', messages: 22 },
  { day: 'Sat', messages: 16 },
  { day: 'Sun', messages: 10 }
];

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: number;
  supplierId: number;
  companyName: string;
  lastMessageTime: Date;
  unreadCount: number;
  supplierImage: string;
}

interface NotifyPanelProps {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[] | null;
  currentUserId: number;
  onSelectChat: (chat: Chat) => void;
  onSendMessage: (chatId: number, content: string) => void;
}

const NotifyPanel = ({
  chats,
  selectedChat,
  messages,
  currentUserId,
  onSelectChat,
  onSendMessage
}: NotifyPanelProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    onSendMessage(selectedChat.id, newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Supplier Communications</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border-r border-gray-200 pr-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Recent Chats</h3>
            <Button variant="ghost" className="text-[#4C2C92] text-sm font-medium">View All</Button>
          </div>
          
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-3 ${
                chat.unreadCount > 0 ? 'border-l-4 border-[#EF4444]' : ''
              } ${selectedChat?.id === chat.id ? 'bg-gray-50' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={chat.supplierImage} alt={chat.companyName} />
                <AvatarFallback>{chat.companyName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-800">{chat.companyName}</h4>
                  <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {/* Placeholder for last message preview */}
                  Last message preview...
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
          
          {chats.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No recent chats
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedChat ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">{selectedChat.companyName}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-gray-500"
                  >
                    View All Messages
                  </Button>
                </div>
                
                <div className="chat-messages space-y-3 max-h-64 overflow-y-auto">
                  {messages && messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex items-start space-x-2 ${
                        message.senderId === currentUserId ? 'justify-end' : ''
                      }`}
                    >
                      {message.senderId !== currentUserId && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedChat.supplierImage} alt={selectedChat.companyName} />
                          <AvatarFallback>{selectedChat.companyName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`p-3 rounded-lg shadow-sm max-w-xs ${
                        message.senderId === currentUserId 
                          ? 'bg-[#4C2C92] bg-opacity-10'
                          : 'bg-white'
                      }`}>
                        <p className="text-sm text-gray-700">{message.content}</p>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                      {message.senderId === currentUserId && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="Store Manager" />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {(!messages || messages.length === 0) && (
                    <div className="text-center text-gray-500 py-4">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C2C92] focus:border-transparent"
                  placeholder="Type your message..."
                />
                <Button 
                  className="absolute right-3 top-3 text-[#4C2C92] p-0 h-auto"
                  variant="ghost"
                  onClick={handleSendMessage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-3">Communication Analytics</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={communicationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Bar dataKey="messages" fill="#4C2C92" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg">
              <div className="text-[#4C2C92] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Chat Selected</h3>
              <p className="text-gray-500 text-center">
                Select a chat from the list to view messages and communicate with suppliers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotifyPanel;
