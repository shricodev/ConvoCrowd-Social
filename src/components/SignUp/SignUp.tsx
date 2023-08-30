import { FC } from "react";

import Link from "next/link";

import { Icons } from "../Icons/Icons";

import UserSignInForm from "../UserSignInForm/UserSignInForm";

interface SignUpProps {
  isModal?: boolean;
}

const SignUp: FC<SignUpProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-12 w-12" />
        <h1 className="pb-2 text-2xl font-semibold tracking-tight">
          Join Us Today!👋
        </h1>
        <p className="mx-auto max-w-xs pb-2 text-sm">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        {/* form */}
        <UserSignInForm />

        <p className="px-8 pt-1 text-center text-sm text-zinc-700 dark:text-slate-200">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 hover:text-zinc-800 dark:hover:text-slate-100"
            // adding this will replace the history stack instead of adding to the history stack.
            // so our modal behaviour works as expected.
            replace={isModal}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
