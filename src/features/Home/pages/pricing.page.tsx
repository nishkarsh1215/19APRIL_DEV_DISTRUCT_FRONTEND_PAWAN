"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Footer, PricingCard } from "../components";

export function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(false);

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

  return (
    <>
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
          Start with a free account to speed up your workflow on public projects
          or boost your entire team with instantly-opening production
          environments.
        </p>

        <div className="flex justify-end items-center mb-8">
          <span
            className={`mr-2 ${annualBilling ? "text-white" : "text-gray-400"}`}
          >
            Annual billing
          </span>
          <Switch
            checked={annualBilling}
            onCheckedChange={setAnnualBilling}
            aria-label={
              annualBilling
                ? "Switch to monthly billing"
                : "Switch to annual billing"
            }
          />
          <span className="sr-only">
            {annualBilling
              ? "Annual billing enabled - save 20%"
              : "Monthly billing"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              tokens={plan.tokens}
              originalTokens={plan.originalTokens}
              description={plan.description}
              annualBilling={annualBilling}
            />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
