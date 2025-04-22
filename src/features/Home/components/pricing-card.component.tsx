import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: number;
  tokens: string;
  originalTokens?: string;
  description: string;
  annualBilling: boolean;
}

export function PricingCard({
  name,
  price,
  tokens,
  originalTokens,
  description,
  annualBilling
}: PricingCardProps) {
  // Apply 20% discount for annual billing
  const monthlyPrice = annualBilling ? price * 0.8 : price;
  const annualPrice = monthlyPrice * 12;

  // Dynamic text based on billing period
  const priceLabel = annualBilling ? "/ month" : "/ month";
  const billingText = annualBilling ? "Billed annually" : "Billed monthly";

  // Annual savings calculation
  const annualSavings = price * 12 - annualPrice;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-3xl font-bold mb-4">{name}</h2>
        <div className="flex items-center mb-2">
          <span className="text-green-400 font-medium">{tokens} tokens</span>
          {originalTokens && (
            <span className="ml-2 text-gray-500 line-through">
              {originalTokens} tokens
            </span>
          )}
        </div>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="p-6 border-b border-zinc-800">
        {annualBilling ? (
          <>
            <div className="flex items-baseline">
              <span className="text-xl">$</span>
              <span className="text-4xl font-bold">{monthlyPrice}</span>
              <span className="text-gray-400 ml-1">{priceLabel}</span>
            </div>
            <div className="mt-2 text-gray-400">
              <p className="text-gray-500">{billingText}</p>
              <p className="mt-1">
                <span className="text-white">${annualPrice}</span> per year
                {annualSavings > 0 && (
                  <span className="ml-2 text-green-400">
                    (Save ${annualSavings})
                  </span>
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline">
              <span className="text-xl">$</span>
              <span className="text-4xl font-bold">{monthlyPrice}</span>
              <span className="text-gray-400 ml-1">{priceLabel}</span>
            </div>
            <p className="text-gray-500 mt-2">{billingText}</p>
          </>
        )}
      </div>

      <div className="p-6 mt-auto">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Get started
        </Button>
      </div>
    </div>
  );
}
