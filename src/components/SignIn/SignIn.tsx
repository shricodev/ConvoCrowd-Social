import { FC } from "react";

import Link from "next/link";

import { Icons } from "../Icons/Icons";

import UserSignInForm from "../UserSignInForm/UserSignInForm";

interface SignInProps {
  isModal?: boolean;
}

const SignIn: FC<SignInProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-12 w-12" />
        <h1 className="pb-2 text-2xl font-semibold tracking-tight">
          Welcome back!
        </h1>
        <p className="mx-auto max-w-xs pb-2 text-sm">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        {/* form */}
        <UserSignInForm />

        <p className="px-8 pt-1 text-center text-sm text-zinc-700">
          New to ConvoCrowd?{" "}
          <Link
            href="/sign-up"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
            // adding this will replace the history stack instead of adding to the history stack.
            // so our modal behaviour works as expected.
            replace={isModal}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
