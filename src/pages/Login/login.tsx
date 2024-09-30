"use client";

import React from "react";
import { Button, Input, Link, Divider, User, Checkbox } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon";
export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const[email, setEmail] = React.useState("");
  const[password, setPassword] = React.useState("");
  
  return (
    <div className="relative flex h-screen w-screen">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center">
          <AcmeIcon size={40} />
          <p className="font-medium">KoiPond</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex w-full items-center justify-start bg-background lg:w-1/2 pl-8 lg:pl-16">
        <div className="flex w-full max-w-sm flex-col items-start gap-4 p-4">
          <div className="w-full text-left">
            <p className="pb-2 text-2xl font-semibold">Welcome Back</p>
            <p className="text-sm text-default-500">Log in to your account to continue</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
            >
              Continue with Google
            </Button>
            <Button
              startContent={<Icon className="text-default-500" icon="fe:facebook" width={24} />}
              variant="bordered"
            >
              Continue with Facebook
            </Button>
          </div>

          <div className="flex w-full items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>

          <form className="flex w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="underlined"
            />
            <Input
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="underlined"
            />
            <div className="flex items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm">
                Remember for 15 days
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button color="primary" type="submit" href="/homeuser">
              Log In
            </Button>
          </form>

          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href="/homeuser" size="sm">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="relative hidden lg:block w-1/2 h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.fineartamerica.com/images-medium-large-5/koi-pond-gene-gregorio.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
