import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { AlertTriangle, Clock, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks";

export function TokenLimitReachedPage() {
  const { user, isAuthenticated } = useUser();

  // Sample user data
  const userData = {
    name: user?.name,
    plan: "Starter",
    tokensUsed: user?.freeCredits,
    tokenLimit: 1000000,
    nextRefreshDate: "May 15, 2025",
    daysUntilRefresh: 12
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center bg-amber-500/20 p-4 rounded-full mb-6">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Token Limit Reached
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              You've used all your available tokens for this month. Upgrade your
              plan to continue using our services without interruption.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Usage Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Usage</h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Current Plan</span>
                      <span className="font-medium">{userData.plan}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Tokens Used</span>
                      <span className="font-medium">
                        {userData.tokensUsed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Token Limit</span>
                      <span className="font-medium">
                        {userData.tokenLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full w-full" />
                  </div>

                  {/* Next Refresh */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 flex items-start">
                    <Clock className="h-5 w-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-zinc-300">
                        Your tokens will refresh on{" "}
                        <span className="font-medium">
                          {userData.nextRefreshDate}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {userData.daysUntilRefresh} days until your next billing
                        cycle
                      </p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="pt-4 space-y-2">
                    <Link
                      to="/contact"
                      className="text-zinc-400 hover:text-white flex items-center text-sm transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upgrade Options</h2>
                  <Link
                    to="/pricing"
                    className={buttonVariants({ variant: "link" })}
                  >
                    See Upgrade Options <ArrowRight />
                  </Link>
                </div>

                {/* Benefits of Upgrading */}
                <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-zinc-900/20 rounded-xl p-6 border border-purple-900/30">
                  <h3 className="font-medium mb-4">Benefits of Upgrading</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="rounded-full bg-purple-500/10 p-1 mr-2 mt-0.5">
                        <svg
                          className="h-3 w-3 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-zinc-300 text-sm">
                        <strong className="text-white">
                          Higher token limits
                        </strong>{" "}
                        - Complete more tasks without interruption
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-purple-500/10 p-1 mr-2 mt-0.5">
                        <svg
                          className="h-3 w-3 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-zinc-300 text-sm">
                        <strong className="text-white">Priority support</strong>{" "}
                        - Get help faster when you need it
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-purple-500/10 p-1 mr-2 mt-0.5">
                        <svg
                          className="h-3 w-3 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-zinc-300 text-sm">
                        <strong className="text-white">
                          Advanced features
                        </strong>{" "}
                        - Unlock powerful capabilities for your projects
                      </span>
                    </li>
                  </ul>
                </div>

                {/* One-time Token Purchase Option */}
                <div className="mt-6 text-center p-4 border border-zinc-800 rounded-lg bg-zinc-800/30">
                  <p className="text-zinc-400 text-sm">
                    Don't want to upgrade your plan?{" "}
                    <Link
                      to="#"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Purchase additional tokens
                    </Link>{" "}
                    as a subscription or one-time option.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
