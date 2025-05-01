import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks";
import { Loader2 } from "lucide-react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export const PaymentButton = ({
  amount,
  className,
  text
}: {
  amount: number;
  className: string;
  text: string;
}) => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const { user } = useUser();

  const handlePayment = () => {
    fetch("http://localhost:5000/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount,
        currency: "USD"
      })
    })
      .then((res) => res.json())
      .then((response) => {
        const options: RazorpayOrderOptions = {
          key: "rzp_live_rgk9Ll05p1Ehl5",
          amount: response.amount,
          currency: "INR",
          name: "Dev Distruct",
          description: "Complete your payment to access PRO features",
          order_id: response.order_id,
          handler: (response) => {
            console.log("Payment Response", response);
            alert("Payment Successful!");
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: ""
          },
          theme: {
            color: "#F37254"
          },
          callback_url: "http://localhost:5000/api/order/verify"
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      });
  };

  return (
    <Button className={className} onClick={handlePayment} disabled={isLoading}>
      {isLoading ? (
        <span>
          Processing Payment <Loader2 className="animate-spin" />
        </span>
      ) : error ? (
        <span className="text-red-500">Error !</span>
      ) : (
        text
      )}
    </Button>
  );
};
