"use client";

import React from "react";
import { Button, Input, Link, Divider, User, Checkbox } from "@nextui-org/react"; //npm install react-slick slick-carousel
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon"; // Make sure this import is correct

export default function SignUpPage() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="relative flex h-screen w-screen">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center">
          <AcmeIcon size={40} />
          <p className="font-medium">KoiPond</p>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="flex w-full items-center justify-center bg-background lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
          <div className="w-full text-left">
            <p className="pb-2 text-xl font-medium">Create Account</p>
            <p className="text-small text-default-500">Sign up for a new account to get started</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
            >
              Sign Up with Google
            </Button>
            <Button
              startContent={<Icon className="text-default-500" icon="fe:facebook" width={24} />}
              variant="bordered"
            >
              Sign Up with Facebook
            </Button>
          </div>

          <div className="flex w-full items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>

          <form className="flex w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="underlined"
            />
            <Input
              isRequired
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
              placeholder="Create a password"
              type={isVisible ? "text" : "password"}
              variant="underlined"
            />
            <Input
              isRequired
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={isVisible ? "text" : "password"}
              variant="underlined"
            />
            <Input
              isRequired
              label="Address"
              name="address"
              placeholder="Enter your address"
              type="text"
              variant="underlined"
            />
            <Input
              isRequired
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              type="tel"
              variant="underlined"
            />
            <Checkbox isRequired className="py-4" size="sm">
              I agree with the&nbsp;
              <Link href="#" size="sm">
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link href="#" size="sm">
                Privacy Policy
              </Link>
            </Checkbox>
            <Button color="primary" type="submit">
              Sign Up
            </Button>
          </form>

          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="/login" size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div
        className="relative hidden w-1/2 flex-col-reverse rounded-medium p-10 shadow-small lg:flex"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/originals/f0/68/d9/f068d9524c85ed69a3cbfd5eed1c8d02.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
       
      </div>
    </div>
  );
}