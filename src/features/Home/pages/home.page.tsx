import { MouseEvent, useContext, useRef, useState, useEffect } from 'react'
import { ArrowUp, Loader2, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ImageUploader, Footer } from '../components'
import { MessageContext } from '@/store/message.store'
import { createChat } from '@/features/Authentication/services'
import Prompt from '@/constants/Prompt'
import { Typewriter } from '../components/typewriter.component'
import Framework from '../components/framework.component'

interface Position {
  x: number
  y: number
}

export const HomePage = () => {
  const navigate = useNavigate()
  const { setMessage } = useContext(MessageContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: rect.width / 2,
      y: rect.height / 2,
    })
    setIsHovered(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.value !== '')
    setPrompt(event.target.value)
  }

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onGenerate(prompt)
    }
  }

  const removeImage = () => {
    setImagePreviewUrl(null)
  }

  const dummyArray = new Array(3).fill(null)

  const onGenerate = async (input: string) => {
    setIsLoading(true)
    const message = {
      prompt: input,
      imageUrl: imagePreviewUrl || undefined,
      firstResponse: 'this is the first code',
    }
    setMessage(message)
    try {
      const { data } = await createChat({
        title: `${prompt.slice(0, 20)}...`,
        prompt: JSON.stringify(input) + Prompt.CHAT_PROMPT,
        image: imagePreviewUrl || '',
      })
      navigate(`/chat/${data.chat_id}`)
    } catch (error) {
      console.error('Chat creation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-svh pt-48 px-5 flex flex-col items-center w-full flex-1 bg-white dark:bg-dim-black text-black dark:text-white">
      <Typewriter text="Dev Distruct will make it!" />
      <div className="flex flex-col items-center justify-center w-full md:w-3/5 2xl:w-2/5 gap-8 mt-6">
        <div
          ref={containerRef}
          className="group relative w-full dark:bg-[#141415] rounded-xl border border-black/20 dark:border-[#2C2C2D] overflow-hidden border-white"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${position.x}px ${position.y}px, 
            rgba(99,102,241,0.15) 0%, transparent 60%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {imagePreviewUrl && (
            <div className="relative p-3">
              <div className="relative inline-block">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
                <Button
                  variant="ghost"
                  className="absolute -top-2 -right-2 size-6 p-0 rounded-full bg-black/50 hover:bg-black/70"
                  onClick={removeImage}
                >
                  <X className="size-4 text-white" />
                </Button>
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Devdistruct, Let's create something amazing!"
            className="p-3 pb-1.5 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            value={prompt}
            disabled={isLoading}
          />

          <div className="h-[52px] w-full p-3 flex justify-between">
            <ImageUploader
              onImageCropped={(croppedImage) => {
                setImagePreviewUrl(croppedImage)
                setIsActive(true)
              }}
            />

            <Button
              disabled={!isActive || isLoading}
              className="size-7 p-0 bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={() => onGenerate(prompt)}
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <Framework />

      <div className="flex flex-col w-full md:w-4/5 2xl:w-3/5 gap-5 mt-12">
        <h3 className="text-lg">Blogs</h3>

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-5 gap-y-12">
          {dummyArray.map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="relative h-48 rounded-xl overflow-hidden w-full group">
                <img
                  src="/supercar.png"
                  alt="image"
                  className="object-cover w-full h-full"
                />

                <div className="absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center w-full h-full bg-gradient-to-b from-gray-200/70 via-gray-300/60 to-gray-800/60 transition-all duration-300">
                  <Link
                    to="/blog/asdrf"
                    className={`bg-gray-900 cursor-pointer text-white hover:bg-gray-800 ${buttonVariants(
                      {
                        variant: 'secondary',
                      },
                    )}`}
                  >
                    Read Blog
                  </Link>
                </div>
              </div>

              <h2>Blog {index + 1}</h2>
              <h5 className="text-gray-400 text-sm -mt-3">
                Lorem ipsum dolor sit amet
              </h5>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </section>
  )
}
