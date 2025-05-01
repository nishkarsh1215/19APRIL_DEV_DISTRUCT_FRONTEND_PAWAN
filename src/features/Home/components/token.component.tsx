import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenBalanceCardProps {
  tokenBalance: number | undefined;
  totalTokens: number | undefined;
  percentRemaining: number | undefined;
}

export function TokenBalanceCard({
  tokenBalance,
  totalTokens,
  percentRemaining
}: TokenBalanceCardProps) {
  // Determine the color based on the percentage remaining
  const getProgressColor = () => {
    if (percentRemaining && percentRemaining <= 10) return "bg-red-500";
    if (percentRemaining && percentRemaining <= 30) return "bg-amber-500";
    return "bg-green-500";
  };

  // Determine if we should show a warning
  const showWarning = percentRemaining && percentRemaining <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 border border-zinc-700 rounded-xl p-4 md:p-6 shadow-lg"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start mb-4 md:mb-0">
          {showWarning && (
            <div className="mr-3 mt-1">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium mb-1">
              You have{" "}
              <span className="text-white font-bold">
                {tokenBalance?.toLocaleString()}
              </span>{" "}
              tokens left
            </h3>
            <p className="text-zinc-400 text-sm">
              {showWarning
                ? "Your tokens are running low. Upgrade now to avoid interruptions."
                : `${percentRemaining}% of your monthly allocation remaining.`}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto">
            Upgrade Now
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor()}`}
            style={{ width: `${percentRemaining}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-zinc-500">
          <span>0</span>
          <span>{totalTokens?.toLocaleString()} tokens</span>
        </div>
      </div>
    </motion.div>
  );
}
