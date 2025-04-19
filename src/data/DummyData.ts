interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CodeFile {
  _id?: string;
  id: string;
  name: string;
  language?: string;
  code: string;
}

export const dummyMessages: Message[] = [
  { role: "user", content: "Hello, this is a dummy message." },
  { role: "assistant", content: "Hi there! This is a dummy response by RIMO." }
];

// ...existing code...
