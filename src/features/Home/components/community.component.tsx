import { ArrowRight, GitFork } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  image: string;
  authorImage: string;
  forkCount: number;
  href: string;
}

interface CommunitySectionProps {
  title?: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
  projects: Project[];
  className?: string;
}

interface SectionContainerProps {
  title: string;
  description: string;
  viewAllLink: string;
  viewAllText: string;
  className?: string;
  children: ReactNode;
}

interface ProjectCardProps {
  title: string;
  image: string;
  authorImage: string;
  forkCount: number;
  href: string;
  delay?: number;
}

export function CommunitySection({
  title = "From our Community",
  description = "Explore what our community is building with Dev Distruct.",
  viewAllLink = "/community",
  viewAllText = "Browse All",
  projects,
  className = ""
}: CommunitySectionProps) {
  const ref = useRef(null);

  return (
    <div ref={ref} className="text-white max-w-7xl">
      <CommunitySection.Container
        title={title}
        description={description}
        viewAllLink={viewAllLink}
        viewAllText={viewAllText}
        className={className}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project, index) => (
            <CommunitySection.Card
              key={project.id}
              title={project.title}
              image={project.image}
              authorImage={project.authorImage}
              forkCount={project.forkCount}
              href={project.href}
              delay={index}
            />
          ))}
        </div>
      </CommunitySection.Container>
    </div>
  );
}

CommunitySection.Container = function CommunitySectionContainer({
  title,
  description,
  viewAllLink,
  viewAllText,
  className,
  children
}: SectionContainerProps) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 mb-4 text-gray-300">{description}</p>
        </div>
        <Link to={viewAllLink} className={buttonVariants({ variant: "link" })}>
          {viewAllText} <ArrowRight />
        </Link>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
};

CommunitySection.Card = function ProjectCard({
  title,
  image,
  authorImage,
  forkCount,
  href,
  delay = 0
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedForkCount =
    forkCount >= 1000
      ? `${(forkCount / 1000).toFixed(1)}K`
      : forkCount.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + delay * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link
        to={href}
        className="block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`bg-zinc-900 rounded-xl overflow-hidden h-full transition-all duration-300 ${
            isHovered ? "transform scale-[1.02] shadow-xl shadow-black/30" : ""
          }`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className={`object-cover transition-transform duration-700 ${
                isHovered ? "scale-105" : ""
              }`}
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                  <img
                    src={authorImage || "/placeholder.svg"}
                    alt="Author"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">{title}</h3>
              </div>
              <div className="flex items-center text-zinc-400 text-sm">
                <GitFork size={14} className="mr-1" />
                <span>{formattedForkCount} Forks</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
