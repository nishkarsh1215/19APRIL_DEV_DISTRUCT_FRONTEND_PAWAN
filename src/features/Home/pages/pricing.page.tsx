import { useUser } from "@/hooks";
import { Footer, PricingCard, TokenBalanceCard } from "../components";

export function PricingPage() {
  const { user } = useUser();

  const pricingPlans = [
    {
      name: "Basic",
      price: 20,
      tokens: "10M",
      description: "Ideal for light users."
    },
    {
      name: "Pro",
      price: 50,
      tokens: "26M",
      originalTokens: "25M",
      description:
        "Designed for professionals who need Dev Distruct Professionally."
    },
    {
      name: "Ultimate",
      price: 100,
      tokens: "Unlimited",
      originalTokens: "50M",
      description: "Perfect for heavy users looking to enhance daily workflows."
    }
  ];

  let tokenBalance;
  // Sample token balance data
  if (user)
    tokenBalance = {
      remaining: user?.freeCredits ? Number(user.freeCredits) : 0,
      total: 1000000,
      percentRemaining: (Number(user.freeCredits) / 1000000) * 100 || 0
    };

  return (
    <>
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Start with a free account to speed up your workflow on public projects
          or boost your entire team with instantly-opening production
          environments.
        </p>

        {/* Token Balance Card */}
        {user ? (
          <div className="mb-12">
            <TokenBalanceCard
              tokenBalance={tokenBalance?.remaining}
              totalTokens={tokenBalance?.total}
              percentRemaining={tokenBalance?.percentRemaining}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              tokens={plan.tokens}
              originalTokens={plan.originalTokens}
              description={plan.description}
            />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
