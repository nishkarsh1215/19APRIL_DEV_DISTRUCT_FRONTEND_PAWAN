import { MouseEvent, useContext, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Loader2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ImageUploader, Footer } from "../components";
import { MessageContext } from "@/store/message.store";
import { createChat } from "@/features/Authentication/services";
import Prompt from "@/constants/Prompt";
import { Typewriter } from "../components/typewriter.component";
import Framework from "../components/framework.component";

interface Position {
  x: number;
  y: number;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const { setMessage } = useContext(MessageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: rect.width / 2,
      y: rect.height / 2
    });
    setIsHovered(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.value !== "");
    setPrompt(event.target.value);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onGenerate(prompt);
    }
  };

  const removeImage = () => {
    setImagePreviewUrl(null);
  };

  const blogs = [
    {
      id: 1,
      title: "Can AI Replace Frontend Developers with Automated UI/UX Design?",
      description:
        "The world of web design has evolved rapidly over the last decade, with the rise of AI-driven tools pushing the boundaries of what's possible in...",
      image: "/img1.jpg",
      href: "/blog/can-ai-replace-frontend-developers"
    },
    {
      id: 2,
      title: "Blog 2",
      description: "(Coming Soon...)",
      image: "/supercar.png"
    },
    {
      id: 3,
      title: "Blog 3",
      description: "(Coming Soon...)",
      image: "/supercar.png"
    }
  ];

  const onGenerate = async (input: string) => {
    setIsLoading(true);
    const message = {
      prompt: input,
      imageUrl: imagePreviewUrl || undefined,
      firstResponse: "this is the first code"
    };
    setMessage(message);
    try {
      const { data } = await createChat({
        title: `${prompt.slice(0, 20)}...`,
        prompt: JSON.stringify(input) + Prompt.CHAT_PROMPT,
        image: imagePreviewUrl || ""
      });
      navigate(`/chat/${data.chat_id}`);
    } catch (error) {
      console.error("Chat creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                opacity: isHovered ? 1 : 0
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
                  setImagePreviewUrl(croppedImage);
                  setIsActive(true);
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

        <div className="flex flex-col w-full md:w-4/5 2xl:w-3/5 gap-5 mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Trending News of AI</h3>
            <Link
              to="/blog"
              className={`${buttonVariants({
                variant: "link"
              })}`}
            >
              <span className="flex items-center gap-2">
                See All <ArrowRight />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-5 gap-y-12">
            {blogs.map(({ id, title, description, image, href }) => (
              <div key={id} className="flex flex-col gap-3">
                <div className="relative h-48 rounded-xl overflow-hidden w-full group">
                  <img
                    src={image}
                    alt="image"
                    className="object-cover w-full h-full aspect-[4/3]"
                  />

                  <div className="absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center w-full h-full bg-gradient-to-b from-gray-200/70 via-gray-300/60 to-gray-800/60 transition-all duration-300">
                    <Link
                      to={href || "/"}
                      className={`bg-gray-900 cursor-pointer text-white hover:bg-gray-800 ${buttonVariants(
                        {
                          variant: "secondary"
                        }
                      )}`}
                    >
                      Read Blog
                    </Link>
                  </div>
                </div>

                <h2>{title}</h2>
                <h5 className="text-gray-400 text-sm -mt-3">{description}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
