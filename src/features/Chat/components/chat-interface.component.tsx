import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowUp, Code2, Loader2 } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { toast } from '@/hooks/use-toast'
import { ChatMessage } from '.'
import {
  getMessages,
  sendCodeMessage,
  sendMessage,
} from '@/features/Authentication/services/axios.service'
import { v4 as uuidv4 } from 'uuid'
import Prompt from '@/constants/Prompt'
import { EditorMessageContext } from '@/store/editor-message.context'
import { FilesContext } from '@/store/file.store'
import { useUser } from '@/hooks'
import { Message, MessageContext } from '@/store/message.store'

interface Message2 {
  id: string
  prompt?: string
  response?: string
  code?: string
  isLoading?: boolean
  likes?: number
  dislikes?: number
}

interface ChatInterfaceProps {
  isMobile: boolean
  chatTitle?: string
  onInputChange?: (input: string) => void
  onEnter?: (input: string) => void // <-- NEW
}

export function ChatInterface({
  isMobile,
  onInputChange,
  onEnter,
}: ChatInterfaceProps) {
  const { isAuthenticated } = useUser()
  const [messages, setMessages] = useState<Message2[]>([])
  const { editorMessage, setEditorMessage } = useContext(EditorMessageContext)
  const { setFiles, setIsFilesLoading } = useContext(FilesContext)
  const [input, setInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toggleEditor, isEditorOpen } = useEditorStore()
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<number>>(
    new Set(),
  )
  const [lastCode, setLastCode] = useState('')
  const { message, setMessage } = useContext(MessageContext)

  const { chat_id } = useParams()

  useEffect(() => {}, [messages])
  useEffect(() => {
    console.log(input)
  }, [input])

  useEffect(() => {
    setIsLoading(true)
    if (chat_id) {
      ;(async () => {
        try {
          setIsLoading(true)
          const { data } = await getMessages(chat_id!)
          setMessages(data.chat_messages || [])
        } catch (error) {
          console.error('Error fetching messages', error)
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [chat_id, editorMessage, setEditorMessage])

  const handleSend = async () => {
    // If user not authenticated, allow only 1 message
    if (!isAuthenticated && messages.length > 0) {
      window.location.href = '/auth'
      return
    }
    const payload = {
      chat_id,
      prompt: input + Prompt.CHAT_PROMPT,
    }
    const userMessage: Message2 = { id: uuidv4(), prompt: input }
    // Optimistic message with loading flag set
    const assistantMessage: Message2 = {
      id: uuidv4(),
      response: '',
      isLoading: true,
      likes: 0,
      dislikes: 0,
    }
    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    try {
      await sendMessage(payload)
      if (chat_id) {
        // Use the correct field "chat_messages" from the API response
        const { data } = await getMessages(chat_id)
        setMessages(data.chat_messages || [])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, response: 'Error sending message', isLoading: false }
            : msg,
        ),
      )
    }
    setIsLoading(false)
  }

  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault()
  //     handleSend()
  //     // generateAiCode()
  //   }
  // }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSend()
      if (onEnter) {
        onEnter(input) // <- Trigger parent-defined function
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setIsActive(newValue !== '')
    setInput(newValue)

    if (onInputChange) {
      onInputChange(newValue)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied to clipboard',
      description: 'The message has been copied to your clipboard.',
    })
  }

  const handleRetry = () => {
    // Implement retry logic here
    toast({
      title: 'Retry',
      description: 'Retrying the last message...',
    })
  }

  const handleLike = (index: number) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
    setDislikedMessages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    toast({
      title: 'Feedback Received',
      description: 'Thank you for your feedback!',
    })
  }

  const handleDislike = (index: number) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
    setLikedMessages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    toast({
      title: 'Feedback Received',
      description: "We're sorry to hear that. We'll work on improving.",
    })
  }

  const generateAiCode = async () => {
    const PROMPT =
      'PLEASE RETURN THE FULL CODE, DO THE NECESSARY CHANGES AFTER READING THE INPUT BUT PLEASE RETURN THE FULL CODE... EVERYTHING SHOULD BE RETURNED...\n' +
      'THIS IS INPUT AND INSTRUCTIONS --> ' +
      input +
      '\n' +
      'THIS IS THE CODE --> ' +
      message?.firstResponse +
      '\n' +
      'PLEASE WRITE FULL CODE, WHAT I SENT AND FOLLOW THE INSTRUCTIONS'

    try {
      setIsFilesLoading(true)
      const response = await sendCodeMessage({
        chat_id,
        prompt: PROMPT,
      })
      const tempImageUrl = message?.imageUrl
      console.log('heyyyyyyyyyyyyyyy')
      console.log(response.data.response)

      const Newmessage: Message = {
        prompt: message?.prompt ?? '',
        imageUrl: tempImageUrl || undefined,
        firstResponse: response.data.response,
      }
      setMessage(Newmessage)

      // NEW: Immediately store the entire returned "files" data into editorMessage for Editor usage
      const newEditorMessage = {
        message_id: uuidv4(),
        prompt: PROMPT,
        response: response.data.response, // a JSON string containing { files: { ... } }
        created_at: new Date().toISOString(),
      }
      setFiles(JSON.parse(response.data.response))
      setEditorMessage(newEditorMessage)
      setIsFilesLoading(false)
    } catch (err) {
      console.error('Failed to generate AI code', err)
    } finally {
      setIsFilesLoading(false)
    }
  }

  if (isLoading) {
    return (
      <h2 className="flex items-center justify-center gap-2 h-screen">
        <span>Loading</span> <Loader2 className="animate-spin h-6 w-6 mr-2" />
      </h2>
    )
  }

  return (
    <div className="flex flex-col h-full items-center text-black dark:text-white bg-white dark:bg-dim-black">
      <div className="flex justify-between gap-5 items-center p-4 w-full">
        <h1 className="font-medium"></h1>
        {!isMobile && (
          <Button variant="outline" size="sm" onClick={toggleEditor}>
            <Code2 className="mr-2 h-4 w-4" />
            {isEditorOpen ? 'Hide Editor' : 'Show Editor'}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-grow w-full max-w-3xl mx-auto px-4">
        {messages.map((message, index) => (
          <>
            <ChatMessage
              key={index}
              message={message}
              onCopy={() => handleCopy(message.code || message.response || '')}
              onRetry={handleRetry}
              onLike={() => handleLike(index)}
              onDislike={() => handleDislike(index)}
              isLiked={likedMessages.has(index)}
              isDisliked={dislikedMessages.has(index)}
            />
          </>
        ))}
      </ScrollArea>

      <div className="w-full max-w-3xl mx-auto px-4 mb-4 border border-gray-700 rounded-lg">
        {/* {imageBase64 && (
          <div className="relative p-3">
            <img
              src={imageBase64}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <Button
              variant="ghost"
              className="absolute -top-2 -right-2"
              onClick={handleRemoveImage}
            >
              X
            </Button>
          </div>
        )} */}
        <input
          type="text"
          placeholder="Devdistruct, use this image to create something amazing!"
          className="p-3 pb-1.5 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          value={input}
          disabled={isLoading}
        />
        <div className="h-[52px] w-full p-3 flex justify-between">
          <span />
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"outline"}
                  className="size-7 p-0 text-black dark:text-white"
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          /> */}
          <Button
            disabled={!isActive || isLoading}
            className="size-7 p-0"
            onClick={handleSend}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  )
}
