import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — dark panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-black flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black text-[10px] font-bold tracking-tight">SN</span>
          </div>
        </div>

        <div className="relative">
          <blockquote className="text-white text-2xl font-medium leading-snug tracking-tight mb-6">
            "An investment in knowledge<br />pays the best interest."
          </blockquote>
          <p className="text-neutral-500 text-sm">— Benjamin Franklin</p>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <p className="text-neutral-500 text-xs">Free to use · No credit card</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mb-8 lg:hidden">
            <span className="text-white text-[10px] font-bold">SN</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Start studying smarter with AI.
          </p>

          <SignupForm />

          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gray-900 font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
