/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, useContext, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Loader2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ImageUploader, Footer, CommunitySection } from "../components";
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
  const [figmaFile, setFigmaFile] = useState<string | null>(null);
  const [figmaFileName, setFigmaFileName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setError] = useState<string | null>(null);

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

  const removeFigmaFile = () => {
    setFigmaFile(null);
    setFigmaFileName(null);
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

  const communityProjects = [
    {
      id: "1",
      title: "Halftone Waves",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 4900,
      href: "/projects/halftone-waves"
    },
    {
      id: "2",
      title: "Supabase Starter",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 5600,
      href: "/projects/supabase-starter"
    },
    {
      id: "3",
      title: "Kids Memory Game",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 5300,
      href: "/projects/kids-memory-game"
    },
    {
      id: "4",
      title: "DynamicFrameLayout",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 4400,
      href: "/projects/dynamic-frame-layout"
    },
    {
      id: "5",
      title: "Artist Portfolio",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 4600,
      href: "/projects/artist-portfolio"
    },
    {
      id: "6",
      title: "Futuristic Dashboard",
      image: "/placeholder.svg?height=400&width=600",
      authorImage: "/placeholder.svg?height=100&width=100",
      forkCount: 10800,
      href: "/projects/futuristic-dashboard"
    }
  ];

  const onGenerate = async (input: string) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    // Create a new message that includes both image and figma data
    const newMessage = {
      prompt: input,
      imageUrl: imagePreviewUrl || undefined,
      figma_file: figmaFile || undefined,
      firstResponse: ""
    };

    setMessage(newMessage);

    try {
      const { data } = await createChat({
        title: input.length > 20 ? `${input.slice(0, 20)}...` : input,
        prompt: input + Prompt.CHAT_PROMPT,
        image: imagePreviewUrl || "",
        figma_file: figmaFile || "" // Include Figma file data in API call
      });
      navigate(`/chat/${data.chat_id}`);
    } catch (error: any) {
      console.error("Chat creation failed:", error);
      // Show a user-friendly error message
      setError(error.message || "Failed to create chat. Please try again.");
      setIsLoading(false);
    }
  };

  const handleFigmaFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show the filename
      setFigmaFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the Figma file data in state
        const fileData = reader.result as string;
        setFigmaFile(fileData);
        setIsActive(true);
      };
      reader.readAsDataURL(file);
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

            {/* Image Preview */}
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

            {/* Figma File Preview */}
            {figmaFileName && (
              <div className="relative p-3">
                <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v5.5H8.5A3.5 3.5 0 0 1 5 5.5z"
                      fill="#1ABCFE"
                    />
                    <path
                      d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"
                      fill="#0ACF83"
                    />
                    <path
                      d="M12 16.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                      fill="#FF7262"
                    />
                    <path
                      d="M5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12z"
                      fill="#F24E1E"
                    />
                    <path
                      d="M12 16.5V12h3.5a3.5 3.5 0 1 1 0 7H12v-2.5z"
                      fill="#A259FF"
                    />
                  </svg>
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {figmaFileName}
                  </span>
                  <Button
                    variant="ghost"
                    className="ml-2 size-6 p-0 rounded-full bg-black/50 hover:bg-black/70"
                    onClick={removeFigmaFile}
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
                  console.log("ImageUrl: ", croppedImage);
                }}
              />

              <div className="relative">
                <label
                  htmlFor="figma-file-upload"
                  className={`inline-flex items-center gap-1.5 p-1.5 rounded-md text-xs cursor-pointer border ${
                    figmaFileName
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-300 dark:border-gray-700"
                  } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                  title="Upload Figma file"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v5.5H8.5A3.5 3.5 0 0 1 5 5.5z"
                      fill="#1ABCFE"
                    />
                    <path
                      d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"
                      fill="#0ACF83"
                    />
                    <path
                      d="M12 16.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                      fill="#FF7262"
                    />
                    <path
                      d="M5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12z"
                      fill="#F24E1E"
                    />
                    <path
                      d="M12 16.5V12h3.5a3.5 3.5 0 1 1 0 7H12v-2.5z"
                      fill="#A259FF"
                    />
                  </svg>
                  <span>{figmaFileName ? "Upload another" : "Figma"}</span>
                </label>
                <input
                  id="figma-file-upload"
                  type="file"
                  accept=".fig"
                  className="sr-only"
                  onChange={handleFigmaFileUpload}
                />
              </div>

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

        {/* Blog Section */}
        <div className="flex flex-col w-full max-w-7xl gap-5 mt-20 mx-4">
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

        {/* Community Project Section */}
        <div className="min-h-screen mt-20 mx-4">
          <CommunitySection projects={communityProjects} />
        </div>
      </section>
      <Footer />
    </>
  );
};
