"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl mb-12 lg:mb-0 lg:w-1/2"
              >
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                      <Mail className="text-purple-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                      <p className="text-zinc-300">info@devdistruct.com</p>
                      <p className="text-zinc-400 text-sm mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-pink-500/20 p-3 rounded-lg mr-4">
                      <MapPin className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Visit Our Office
                      </h3>
                      <p className="text-zinc-300">India</p>
                      <p className="text-zinc-400 text-sm mt-1">
                        By appointment only
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-500/20 p-3 rounded-lg mr-4">
                      <Phone className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                      <p className="text-zinc-300">+1 (555) 123-4567</p>
                      <p className="text-zinc-400 text-sm mt-1">
                        Mon-Fri, 9am-5pm
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Headquarter Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="rounded-xl overflow-hidden border border-zinc-800 h-[400px] relative lg:w-1/2"
              >
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="mx-auto text-pink-500 mb-4" size={48} />
                    <h3 className="text-2xl font-medium mb-2">
                      Dev Distruct Headquarters
                    </h3>
                    <p className="text-zinc-300">Bengaluru, India</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
