import { PaymentButton } from "./payment-button.component";

interface PricingCardProps {
  name: string;
  price: number;
  tokens: string;
  originalTokens?: string;
  description: string;
}

export function PricingCard({
  name,
  price,
  tokens,
  originalTokens,
  description
}: PricingCardProps) {
  const priceLabel = "/ month";
  const billingText = "Billed monthly";

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
        <div className="flex items-baseline">
          <span className="text-xl">$</span>
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400 ml-1">{priceLabel}</span>
        </div>
        <p className="text-gray-500 mt-2">{billingText}</p>
      </div>

      <div className="p-6 mt-auto">
        <PaymentButton
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          amount={price}
          text="Get Started"
        />
      </div>
    </div>
  );
}
