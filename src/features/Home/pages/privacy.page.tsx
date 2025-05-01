import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function PrivacyPolicyPage() {
  const effectiveDate = "22 April 2025";

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
            <div className="inline-flex items-center justify-center bg-purple-500/20 p-3 rounded-full mb-6">
              <Shield className="text-purple-500" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-zinc-400">Effective Date: {effectiveDate}</p>
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
                At Dev Distruct, we respect your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you visit our website or use our services. By accessing or using
                our services, you agree to this policy.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                1. Information We Collect
              </h2>
              <p className="text-zinc-300 mb-4">
                We may collect the following types of information:
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                a. Personal Information
              </h3>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping address</li>
                <li>Payment information (processed securely via Razorpay)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-white">
                b. Technical Information
              </h3>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Time zone and location</li>
                <li>Device type and OS</li>
                <li>
                  Pages visited and interactions (via cookies and analytics)
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                2. How We Use Your Information
              </h2>
              <p className="text-zinc-300 mb-4">
                We use the collected data to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send confirmations</li>
                <li>Respond to your inquiries and provide support</li>
                <li>
                  Send updates, newsletters, or promotional material (only with
                  your consent)
                </li>
                <li>Improve user experience through analytics and feedback</li>
                <li>Ensure legal and regulatory compliance</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                3. Razorpay Payments
              </h2>
              <p className="text-zinc-300">
                All payment transactions are handled by Razorpay, a PCI
                DSS-compliant payment gateway. We do not store any of your card
                or payment details on our servers. Please refer to Razorpay's
                privacy policy for more details.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                4. Cookies & Tracking Technologies
              </h2>
              <p className="text-zinc-300">
                We use cookies to personalize content, analyze site traffic, and
                understand user behavior. You can control cookie settings
                through your browser preferences.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                5. Sharing of Your Data
              </h2>
              <p className="text-zinc-300 mb-4">
                We do not sell, rent, or trade your personal information. We may
                share your data only with:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>Service providers (e.g., hosting, payment processors)</li>
                <li>Legal authorities (if required under law)</li>
                <li>Internal teams to deliver services and support</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                6. Data Security
              </h2>
              <p className="text-zinc-300">
                We implement industry-standard security measures including SSL
                encryption, firewalls, and secure servers to protect your data.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                7. Your Rights
              </h2>
              <p className="text-zinc-300 mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-1">
                <li>Access, correct, or delete your personal data</li>
                <li>Withdraw consent for marketing</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                To exercise these rights, email us at{" "}
                <a
                  href="mailto:info@devdistruct.com"
                  className="text-purple-400 hover:text-purple-300"
                >
                  info@devdistruct.com
                </a>
                .
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                8. Children's Privacy
              </h2>
              <p className="text-zinc-300">
                Our services are not intended for individuals under the age of
                13. We do not knowingly collect data from minors.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                9. Changes to This Policy
              </h2>
              <p className="text-zinc-300">
                We may update this Privacy Policy periodically. Any changes will
                be posted on this page with an updated "Effective Date."
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                10. Contact Us
              </h2>
              <p className="text-zinc-300">
                If you have questions about this Privacy Policy or how your data
                is handled, please contact us at:
                <br />
                <a
                  href="mailto:info@devdistruct.com"
                  className="text-purple-400 hover:text-purple-300"
                >
                  info@devdistruct.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
