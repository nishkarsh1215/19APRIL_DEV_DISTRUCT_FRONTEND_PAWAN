"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

export function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center bg-pink-500/20 p-3 rounded-full mb-6">
              <RefreshCcw className="text-pink-500" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cancellation & Refund Policy
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 md:p-8"
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300">
                At Dev Distruct, we value your satisfaction and aim to provide
                transparent and hassle-free payment experiences. This
                Cancellation & Refund Policy outlines the terms and conditions
                for any payments made through the Razorpay payment gateway.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                1. Cancellation Policy
              </h2>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                Service Cancellation:
              </h3>
              <p className="text-zinc-300">
                You may request cancellation of a purchased service within 24
                hours of payment, provided that work on the service has not
                already commenced.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                How to Cancel:
              </h3>
              <p className="text-zinc-300">
                To initiate a cancellation, please email us at{" "}
                <a
                  href="mailto:support@devdistruct.com"
                  className="text-pink-400 hover:text-pink-300"
                >
                  support@devdistruct.com
                </a>{" "}
                with your order ID, payment reference, and reason for
                cancellation.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                Non-Cancellable Services:
              </h3>
              <p className="text-zinc-300">
                Services that are custom-built, time-sensitive, or already in
                progress are not eligible for cancellation once initiated.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                2. Refund Policy
              </h2>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                Eligibility for Refund:
              </h3>
              <p className="text-zinc-300">
                A full or partial refund may be issued only if the service is
                cancelled within the eligible window and no significant work has
                been started.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                Processing Time:
              </h3>
              <p className="text-zinc-300">
                Approved refunds will be processed within 7–10 business days to
                the original payment method via Razorpay.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                Non-Refundable Items:
              </h3>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>Completed services</li>
                <li>Third-party charges or platform fees</li>
                <li>Subscription fees once billed</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                3. Disputes & Contact
              </h2>
              <p className="text-zinc-300">
                If you believe you've been wrongfully charged or wish to dispute
                a transaction, please reach out to our support team at{" "}
                <a
                  href="mailto:info@devdistruct.com"
                  className="text-pink-400 hover:text-pink-300"
                >
                  info@devdistruct.com
                </a>{" "}
                within 7 days of payment. We will investigate the matter and
                respond promptly.
              </p>

              <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <p className="text-zinc-300 text-sm">
                  <strong className="text-white">Note:</strong> Razorpay's own
                  terms and processing timelines may apply in some cases. For
                  any transaction-related queries, you may also refer to{" "}
                  <a
                    href="https://razorpay.com/support/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                  >
                    https://razorpay.com/support/
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
