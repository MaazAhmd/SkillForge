import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { id } = useParams(); // Get the chat ID from the URL params

  return (
    <div className="flex h-screen">
      {/* Left Sidebar: List of chats */}
      <div className="bg-gray-100 w-1/3 p-4 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <div className="space-y-4">
          {/* Chat 1 */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
            <img
              src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">Esthera Jackson</p>
              <p className="text-sm text-gray-500">Hey, how's it going?</p>
            </div>
          </div>

          {/* Add more chat items here */}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 bg-white p-6 flex flex-col h-screen">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">Esthera Jackson</h2>
              <p className="text-sm text-gray-500">Last seen 2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Chat Messages (Scrollable area) */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[400px]">
          <div className="flex items-start space-x-3 w-full">
            <img
              src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
              <p className="font-medium">Esthera Jackson</p>
              <p className="text-sm text-gray-600">Hi, I need more information about the product!</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 w-full justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
              <p className="font-medium">You</p>
              <p className="text-sm">Sure, what would you like to know?</p>
            </div>
            <img
              src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
          </div>
        </div>

        {/* Message Input Section */}
        <div className="flex items-center gap-3 border-t pt-4 mt-4">
          <input
            type="text"
            placeholder="Type a message"
            className="border rounded-full px-4 py-2 w-full"
          />
          <button className="text-sm bg-blue-500 text-white px-4 py-1 rounded-full">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
