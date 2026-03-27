import { useState } from 'react';
import { deriveKey } from '../lib/crypto';
import { KeyRound, LogIn, User } from 'lucide-react';

interface JoinRoomProps {
  onJoin: (data: { roomId: string, secretKey: CryptoKey, username: string }) => void;
}

export default function JoinRoom({ onJoin }: JoinRoomProps) {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !password || !username) return;

    setIsLoading(true);
    try {
      // توليد مفتاح التشفير من كلمة المرور
      const secretKey = await deriveKey(password);
      onJoin({ roomId, secretKey, username });
    } catch (error) {
      console.error("Error generating key", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-white text-center">الدخول لغرفة سرية</h2>
      <form onSubmit={handleJoin} className="space-y-4">
        
        <div>
          <label className="block text-gray-400 text-sm mb-2">اسمك المستعار</label>
          <div className="relative">
            <User className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="مثال: Agent 47"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">معرف الغرفة (Room ID)</label>
          <div className="relative">
            <LogIn className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="مثال: dark_room_99"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">الرقم السري للغرفة (للتشفير)</label>
          <div className="relative">
            <KeyRound className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="الرقم السري لفك تشفير الرسائل"
            />
          </div>
          <p className="text-xs text-red-400 mt-2">ملاحظة: إذا أدخلت رقماً سرياً خاطئاً لن تتمكن من قراءة الرسائل.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? 'جاري التأمين...' : 'دخول مشفر'}
        </button>
      </form>
    </div>
  );
}