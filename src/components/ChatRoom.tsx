import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { encryptMessage, decryptMessage } from '../lib/crypto';
import { Send, LogOut, ShieldCheck } from 'lucide-react';

interface ChatRoomProps {
  roomData: { roomId: string, secretKey: CryptoKey, username: string };
  onLeave: () => void;
}

interface EncryptedMessage {
  id: string;
  sender: string;
  ciphertext: string;
  iv: string;
  timestamp: any;
}

interface DecryptedMessage {
  id: string;
  sender: string;
  text: string;
}

export default function ChatRoom({ roomData, onLeave }: ChatRoomProps) {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي لآخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // استماع للرسائل في الوقت الفعلي وفك تشفيرها
  useEffect(() => {
    const q = query(collection(db, `rooms/${roomData.roomId}/messages`), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const decMsgs: DecryptedMessage[] = [];
      
      for (const doc of snapshot.docs) {
        const data = doc.data() as EncryptedMessage;
        let text = "";
        if (data.ciphertext && data.iv) {
          text = await decryptMessage(data.ciphertext, data.iv, roomData.secretKey);
        }
        decMsgs.push({
          id: doc.id,
          sender: data.sender,
          text: text
        });
      }
      setMessages(decMsgs);
    });

    return () => unsubscribe();
  }, [roomData]);

  // إرسال رسالة جديدة (تشفير قبل الإرسال)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage(''); // تفريغ الحقل مباشرة لتجربة مستخدم أفضل

    try {
      const { ciphertext, iv } = await encryptMessage(messageText, roomData.secretKey);
      
      await addDoc(collection(db, `rooms/${roomData.roomId}/messages`), {
        sender: roomData.username,
        ciphertext,
        iv,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-5 h-5" />
          <div>
            <h3 className="font-bold text-white">غرفة: {roomData.roomId}</h3>
            <p className="text-xs text-green-500">اتصال آمن و مشفر E2EE</p>
          </div>
        </div>
        <button onClick={onLeave} className="text-gray-400 hover:text-red-500 transition-colors p-2">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">لا توجد رسائل بعد. ابدأ المحادثة السرية.</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === roomData.username;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-500 mb-1 px-1">{msg.sender}</span>
                <div className={`px-4 py-2 max-w-[80%] rounded-2xl ${
                  isMe 
                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-950 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك السرية هنا..."
            className="flex-1 bg-gray-900 border border-gray-800 text-white rounded-full py-3 px-5 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white rounded-full w-12 h-12 flex justify-center items-center transition-colors"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
}