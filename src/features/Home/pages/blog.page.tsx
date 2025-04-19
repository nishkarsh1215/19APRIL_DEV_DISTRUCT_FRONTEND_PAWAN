import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Footer } from "../components";

export const BlogDetailsPage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <img
            src="/img1.jpg"
            alt="Football and AI"
            className="w-full mb-4 rounded-lg shadow-md aspect-video object-cover"
          />
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Can AI Replace Frontend Developers with Automated UI/UX Design?
          </h1>
          <div className="text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <span>Category: Blog</span>
            <span className="flex items-center gap-2 my-2 sm:my-0">
              <Clock /> 7 Minutes
            </span>
            <span>January 6, 2025</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="prose max-w-4xl mx-auto"
        >
          <p>
            The world of web design has evolved rapidly over the last decade,
            with the rise of AI-driven tools pushing the boundaries of
            what&apos;s possible in UI/UX design. As we look at tools like{" "}
            <span className="font-extrabold">Framer AI</span> and{" "}
            <span className="font-extrabold">Galileo AI</span>, it's hard not to
            wonder:{" "}
            <span className="font-extrabold">
              Can AI completely replace frontend developers, particularly in the
              realm of UI/UX design?
            </span>
          </p>
          <h2 className="text-2xl md:text-3xl mt-4 font-bold mb-2">
            AI in UI/UX Design Today
          </h2>
          <p>
            AI tools are already transforming how designers work. AI-driven
            platforms allow designers to generate entire UI layouts with minimal
            human input. For example, Framer AI uses machine learning to create
            responsive designs that adapt to user preferences. The idea is that
            AI can make these design processes more efficient by learning from
            vast amounts of data, thereby enhancing the user experience based on
            patterns and behaviors. These tools automate mundane tasks such as
            layout generation, style matching, and even accessibility checks,
            reducing the time and effort required to create high-quality
            designs. They can also streamline the process by offering
            suggestions for color palettes, typography, and layout adjustments
            based on design best practices and user feedback.
          </p>
          <h2 className="text-2xl md:text-3xl mt-4 font-bold mb-2">
            The Potential of AGI in Design
          </h2>
          <p>
            With the advancement of{" "}
            <span className="font-extrabold">
              Artificial General Intelligence (AGI)
            </span>
            , the question arises: Could AI ever fully replace the role of human
            designers? AGI could understand design principles on a much deeper
            level. It could evaluate user data, iterating designs based on
            subtle human emotions and behavior patterns, something current AI is
            just beginning to approach. Imagine a tool capable of not only
            creating design mockups but also adapting those designs in real-time
            based on live user feedback or A/B testing. This could dramatically
            speed up the design process and allow for even more personalized
            experiences for users.
          </p>
        </motion.div>
        <div className="mt-10 flex justify-between">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/blog/0"
            className="text-blue-500 hover:underline"
          >
            Previous Post
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/blog/2"
            className="text-blue-500 hover:underline"
          >
            Next Post
          </motion.a>
        </div>
      </div>
      <Footer />
    </>
  );
};
