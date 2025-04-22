"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Zap,
  Palette,
  Rocket,
  Users,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "../components";

export function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">
              About Us
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-8">
              From Sketch to Code—at the Speed of Thought
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
              At Dev Distruct, we're not just building a tool—we're reimagining
              how software gets built. We're the team behind an AI-powered agent
              that takes your raw ideas—sketches, Figma files, napkin doodles,
              even plain-language prompts—and transforms them into clean,
              responsive, production-ready websites in seconds. No templates. No
              drag-and-drop gimmicks. Just intelligent, reliable code—generated
              instantly.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </section>

      {/* Why We Exist */}
      <section className="py-20 reveal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center">
              <span className="bg-purple-500 p-2 rounded-lg mr-4">
                <Users size={24} />
              </span>
              Why We Exist
            </h2>
            <p className="text-xl text-zinc-300 leading-relaxed mb-8">
              Let's face it—building software is still too slow.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed mb-6">
              Designers wait weeks for developers to implement ideas. Developers
              drown in boilerplate. Startups burn time and budget on MVPs that
              should take hours, not months.
            </p>
            <p className="text-xl font-semibold text-zinc-200">
              We're here to end that.
            </p>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-20 bg-zinc-900/50 reveal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center">
              <span className="bg-pink-500 p-2 rounded-lg mr-4">
                <Code size={24} />
              </span>
              What We're Building
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed mb-12">
              Dev Distruct is a zero-guesswork, AI-driven design-to-code engine
              trained on 10,000+ UI patterns. It's laser-focused, incredibly
              accurate (&gt;90%), and made for builders who want to move fast
              without breaking things.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="bg-amber-500/20 p-2 rounded-lg mr-3">
                    <Rocket className="text-amber-500" size={20} />
                  </span>
                  <h3 className="text-xl font-semibold">10–100x faster</h3>
                </div>
                <p className="text-zinc-400">
                  than manual coding or no-code tools
                </p>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="bg-pink-500/20 p-2 rounded-lg mr-3">
                    <Palette className="text-pink-500" size={20} />
                  </span>
                  <h3 className="text-xl font-semibold">
                    Ship your vision instantly
                  </h3>
                </div>
                <p className="text-zinc-400">no more dev queues</p>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-500/20 p-2 rounded-lg mr-3">
                    <Code className="text-purple-500" size={20} />
                  </span>
                  <h3 className="text-xl font-semibold">
                    Automate the boring stuff
                  </h3>
                </div>
                <p className="text-zinc-400">focus on what actually matters</p>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <Zap className="text-blue-500" size={20} />
                  </span>
                  <h3 className="text-xl font-semibold">Build MVPs in hours</h3>
                </div>
                <p className="text-zinc-400">not weeks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 reveal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center">
              <span className="bg-blue-500 p-2 rounded-lg mr-4">
                <Sparkles size={24} />
              </span>
              Our Vision
            </h2>

            <div className="relative pl-6 border-l-2 border-purple-500/50">
              <div className="mb-12 relative">
                <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Phase 1: Instant static websites from any input
                </h3>
                <p className="text-zinc-400">
                  We're here. Building the foundation.
                </p>
              </div>

              <div className="mb-12 relative">
                <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-xs font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Next up: Dynamic apps (2025)
                </h3>
                <p className="text-zinc-400">
                  Taking it to the next level with interactive applications.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-xs font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Then full-stack, end-to-end AI development
                </h3>
                <p className="text-zinc-400">
                  The complete revolution of software development.
                </p>
              </div>
            </div>

            <p className="text-lg text-zinc-300 mt-12 leading-relaxed">
              We're not chasing trends. We're building the foundation for a
              world where software builds itself—and creators are only limited
              by imagination, not code.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-zinc-900/50 reveal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center">
              <span className="bg-amber-500 p-2 rounded-lg mr-4">
                <Users size={24} />
              </span>
              Who We Are
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              We're a fast-moving, no-BS team of engineers, designers, and
              technologists obsessed with one thing: execution. No VC funding.
              No fluff. Just raw momentum, powered by machine learning, computer
              vision, and pure passion for solving real problems.
            </p>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20 my-8">
              <p className="text-xl font-medium text-center">
                We believe creativity shouldn't be bottlenecked by dev time.
                <br />
                And we're here to automate the gap—beautifully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Revolution */}
      <section className="py-24 reveal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Join the Revolution
            </h2>
            <p className="text-xl text-zinc-300 leading-relaxed mb-12">
              The future of software isn't written line by line.
              <br />
              It's generated—instantly, intelligently, and exactly as you
              imagined it.
              <br />
              Welcome to <span className="font-bold">Dev Distruct.</span>
            </p>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Let's build the future. Faster{" "}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
