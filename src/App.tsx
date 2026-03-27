import { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import { Ghost } from 'lucide-react';

function App() {
  const [roomData, setRoomData] = useState<{ roomId: string, secretKey: CryptoKey, username: string } | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix/Hacker Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-gray-950 pointer-events-none"></div>

      <header className="mb-8 z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Ghost className="w-10 h-10 text-cyan-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            GhostChat
          </h1>
        </div>
        <p className="text-gray-400 text-sm">دردشة سرية مشفرة بالكامل (E2EE)</p>
      </header>

      <main className="w-full max-w-2xl z-10 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {!roomData ? (
          <JoinRoom onJoin={(data) => setRoomData(data)} />
        ) : (
          <ChatRoom roomData={roomData} onLeave={() => setRoomData(null)} />
        )}
      </main>
    </div>
  );
}

export default App;