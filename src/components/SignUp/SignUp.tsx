import { FC } from "react";
import { Icons } from "../Icons/Icons";
import Link from "next/link";
import UserSignInForm from "../UserSignInForm/UserSignInForm";

const SignUp: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-10 w-10" />
        <h1 className="pb-2 text-2xl font-semibold tracking-tight">
          Join Us Today!👋
        </h1>
        <p className="mx-auto max-w-xs pb-2 text-sm">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        {/* form */}
        <UserSignInForm />

        <p className="px-8 pt-1 text-center text-sm text-zinc-700">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
