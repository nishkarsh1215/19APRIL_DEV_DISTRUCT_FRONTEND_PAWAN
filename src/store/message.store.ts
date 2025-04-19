import { createContext } from 'react'

export interface Message {
  prompt: string
  imageUrl?: string
  firstResponse?: string
}

export const MessageContext = createContext<{
  message: Message | null
  setMessage: (msg: Message | null) => void
}>({
  message: null,
  setMessage: () => {},
})
