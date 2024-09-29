"use client";

import React from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input, Button, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function SignUpPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
          <div className="flex flex-col items-center pb-6">
            <h1 className={title()}>Sign Up Page</h1>
            <p className="text-small text-default-500">Create an account to get started</p>
          </div>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col">
              <Input
                isRequired
                label="Email"
                type="email"
                placeholder="Enter your email"
                variant="bordered"
              />
              <Input
                isRequired
                label="Password"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                variant="bordered"
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
              />
              <Input
                isRequired
                label="Confirm Password"
                type={isConfirmVisible ? "text" : "password"}
                placeholder="Confirm your password"
                variant="bordered"
                endContent={
                  <button type="button" onClick={toggleConfirmVisibility}>
                    {isConfirmVisible ? (
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
              />
              <Input
                isRequired
                label="Address"
                type="text"
                placeholder="Enter your address"
                variant="bordered"
              />
              <Input
                isRequired
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                variant="bordered"
              />
            </div>
            <Button type="submit" color="primary">
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
    </DefaultLayout>
  );
}