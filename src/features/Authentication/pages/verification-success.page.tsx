import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { resendVerification, verifyEmail } from "../services";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast, useUser } from "@/hooks";

export function VerificationMessagePage() {
  const { token } = useParams();
  const [verified, setVerified] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    async function verify() {
      const response = await verifyEmail(token!);
      if (response.statusText === "OK") {
        setVerified(true);
      } else {
        setVerified(false);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resendVerificationLink = async () => {
    try {
      await resendVerification({ email: user.email });
      toast({ title: "Please check your email" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to resend verification link" });
    }
  };

  if (!verified)
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        <h1 className="text-xl font-semibold">
          Verification Failed or Token Expired
        </h1>
        <Button onClick={resendVerificationLink}>
          Resend Verification Link
        </Button>
      </div>
    );
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-xl font-semibold">
        Congratulations, Your email has been successfully verified! You can now
        login
      </h1>
      <Link to="/auth" className={buttonVariants()}>
        Login
      </Link>
    </div>
  );
}
