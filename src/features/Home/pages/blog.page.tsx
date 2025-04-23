import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Footer } from "../components";

export const BlogDetailsPage = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto py-10 tracking-wide text-lg leading-[2rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 mx-6"
        >
          <h1 className="text-4xl md:text-5xl mb-20 tracking-wider leading-[3rem]">
            Can AI Replace Frontend Developers with Automated UI/UX Design?
          </h1>
          <img
            src="/img1.jpg"
            alt="Football and AI"
            className="w-full mb-4 rounded-lg shadow-md aspect-[21/6] object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="prose max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-6 px-4"
        >
          <div className="text-gray-300 flex flex-row items-center justify-between sm:justify-start sm:flex-col">
            <span className="flex items-center gap-2 sm:my-2 sm:pb-4">
              <Clock /> 7 Minutes Read
            </span>
            <span className="sm:mt-4">January 6, 2025</span>
          </div>
          <div className="col-span-4">
            <h2 className="text-xl md:text-2xl mt-2 mb-6 font-extrabold">
              AI in UI/UX Design Today
            </h2>
            <p>
              The world of web design has evolved rapidly over the last decade,
              with the rise of AI-driven tools pushing the boundaries of
              what&apos;s possible in UI/UX design. As we look at tools like{" "}
              <span className="font-extrabold">Framer AI</span> and{" "}
              <span className="font-extrabold">Galileo AI</span>, it's hard not
              to wonder:{" "}
              <span className="font-extrabold">
                Can AI completely replace frontend developers, particularly in
                the realm of UI/UX design?
              </span>
            </p>
            <p>
              AI tools are already transforming how designers work. AI-driven
              platforms allow designers to generate entire UI layouts with
              minimal human input. For example, Framer AI uses machine learning
              to create responsive designs that adapt to user preferences. The
              idea is that AI can make these design processes more efficient by
              learning from vast amounts of data, thereby enhancing the user
              experience based on patterns and behaviors. These tools automate
              mundane tasks such as layout generation, style matching, and even
              accessibility checks, reducing the time and effort required to
              create high-quality designs. They can also streamline the process
              by offering suggestions for color palettes, typography, and layout
              adjustments based on design best practices and user feedback.
            </p>
            <h2 className="text-xl md:text-2xl mt-8 mb-6 font-extrabold">
              The Potential of AGI in Design
            </h2>
            <p>
              With the advancement of{" "}
              <span className="font-extrabold">
                Artificial General Intelligence (AGI)
              </span>
              , the question arises: Could AI ever fully replace the role of
              human designers? AGI could understand design principles on a much
              deeper level. It could evaluate user data, iterating designs based
              on subtle human emotions and behavior patterns, something current
              AI is just beginning to approach. Imagine a tool capable of not
              only creating design mockups but also adapting those designs in
              real-time based on live user feedback or A/B testing. This could
              dramatically speed up the design process and allow for even more
              personalized experiences for users.
            </p>
          </div>
        </motion.div>
        <div className="mt-10 flex justify-between mx-4">
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
