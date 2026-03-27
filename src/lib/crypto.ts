// وحدة التشفير من طرف إلى طرف (End-to-End Encryption) باستخدام Web Crypto API

// تحويل النص السري إلى مفتاح تشفير قوي باستخدام PBKDF2
export const deriveKey = async (password: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("GhostChat_Salt_2024"), // يمكن تغييره لزيادة الأمان
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// تشفير الرسالة
export const encryptMessage = async (message: string, key: CryptoKey): Promise<{ ciphertext: string, iv: string }> => {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(message)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedContent))),
    iv: btoa(String.fromCharCode(...iv))
  };
};

// فك تشفير الرسالة
export const decryptMessage = async (ciphertext: string, ivBase64: string, key: CryptoKey): Promise<string> => {
  try {
    const dec = new TextDecoder();
    const encryptedData = new Uint8Array(atob(ciphertext).split("").map(c => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(ivBase64).split("").map(c => c.charCodeAt(0)));

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData
    );

    return dec.decode(decryptedContent);
  } catch (e) {
    return "🔒 [رسالة مشفرة: المفتاح غير صحيح]";
  }
};