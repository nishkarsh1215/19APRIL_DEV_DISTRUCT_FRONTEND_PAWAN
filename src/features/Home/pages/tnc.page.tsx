import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function TermsPage() {
  const effectiveDate = "22 April 2025";
  const companyName = "Dev Distruct";
  const website = "www.devdistruct.com";
  const supportEmail = "info@devdistruct.com";
  const governingLaw = "India";

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
            <div className="inline-flex items-center justify-center bg-amber-500/20 p-3 rounded-full mb-6">
              <FileText className="text-amber-500" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms and Conditions
            </h1>
            <div className="text-zinc-400 space-y-1">
              <p>Effective Date: {effectiveDate}</p>
              <p>Company Name: {companyName}</p>
              <p>Website: {website}</p>
              <p>
                Support Email:{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-amber-400 hover:text-amber-300"
                >
                  {supportEmail}
                </a>
              </p>
            </div>
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
                Please read these Terms and Conditions ("Terms") carefully
                before using our website or services. By accessing or using any
                part of our platform, you agree to be bound by these Terms. If
                you do not agree with any part of the Terms, you must not access
                the website or use our services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                1. Use of Our Services
              </h2>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>You must be at least 18 years old to use our services.</li>
                <li>
                  You agree to provide accurate and complete information during
                  sign-up or purchase.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                2. Intellectual Property
              </h2>
              <p className="text-zinc-300">
                All content, branding, logos, graphics, and software on this
                website are the intellectual property of Dev Distruct unless
                otherwise stated. Unauthorized use, reproduction, or
                distribution is strictly prohibited.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                3. Payments and Billing
              </h2>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>
                  All transactions on our platform are securely processed via
                  Razorpay.
                </li>
                <li>
                  Prices and service details are displayed clearly before
                  purchase. By making a payment, you agree to the pricing and
                  terms.
                </li>
                <li>
                  Any taxes, fees, or third-party charges are the responsibility
                  of the customer.
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                4. Cancellation and Refund Policy
              </h2>
              <p className="text-zinc-300">
                Our cancellation and refund policies are governed by our
                Cancellation & Refund Policy. In general:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>
                  Cancellations must be made within 24 hours of purchase and
                  before service work begins.
                </li>
                <li>
                  Refunds, if applicable, will be processed within 7–10 business
                  days to the original payment method.
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                5. User Conduct
              </h2>
              <p className="text-zinc-300">You agree not to:</p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2">
                <li>
                  Violate any local, state, national, or international law
                </li>
                <li>Infringe on our intellectual property rights</li>
                <li>
                  Upload harmful code or engage in behavior that disrupts our
                  website or services
                </li>
                <li>
                  Use our services for any illegal or unauthorized purpose
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                6. Service Modification and Termination
              </h2>
              <p className="text-zinc-300">
                We reserve the right to modify, suspend, or discontinue any part
                of our services at any time without notice. We also reserve the
                right to terminate your access if you violate these Terms.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                7. Limitation of Liability
              </h2>
              <p className="text-zinc-300">
                Dev Distruct shall not be liable for any indirect, incidental,
                special, or consequential damages arising out of your use or
                inability to use our services. Our total liability shall not
                exceed the amount paid for the specific service in question.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                8. Disclaimer
              </h2>
              <p className="text-zinc-300">
                All services and content are provided "as is" without warranties
                of any kind, either express or implied. We do not guarantee that
                the site will be error-free or uninterrupted.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                9. Third-Party Links and Tools
              </h2>
              <p className="text-zinc-300">
                Our site may include tools or links to third-party websites,
                including Razorpay, for payment. We are not responsible for the
                content or behavior of these external sites.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                10. Governing Law
              </h2>
              <p className="text-zinc-300">
                These Terms shall be governed by and construed in accordance
                with the laws of {governingLaw}, without regard to its conflict
                of law principles.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                11. Changes to These Terms
              </h2>
              <p className="text-zinc-300">
                We reserve the right to update these Terms at any time.
                Continued use of our services after changes implies acceptance
                of the revised Terms. The latest version will always be
                available on this page.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                12. Contact Us
              </h2>
              <p className="text-zinc-300">
                For any questions or concerns about these Terms, please reach
                out to us:
                <br />
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-amber-400 hover:text-amber-300"
                >
                  {supportEmail}
                </a>
              </p>

              <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <p className="text-zinc-300 text-sm">
                  <strong className="text-white">Note:</strong> By using our
                  services, you acknowledge that you have read, understood, and
                  agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
