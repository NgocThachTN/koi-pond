"use client";

import React, { FormEvent, useState } from "react";
import {
  Button,
  Input,
  Link,
  Divider,
  User,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon";
import { loginApi } from './../../apis/user.api';
import { useNavigate } from 'react-router-dom'; // Add this import at the top of your file
import { useAuth } from '@apis/authen';

export default function Login() {  

  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await loginApi(email, password);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('userEmail', response.data.email); // Added this line
      await login(email, password);
      navigate('/homeuser');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorModalMessage("Invalid email or password. Please try again.");
      setIsErrorModalOpen(true);
    }
  }

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
            <p className="text-sm text-default-500">
              Log in to your account to continue
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
            >
              Continue with Google
            </Button>
            <Button
              startContent={
                <Icon
                  className="text-default-500"
                  icon="fe:facebook"
                  width={24}
                />
              }
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

          {errorMessage && (
            <div className="w-full p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}

          <form
            className="flex w-full flex-col gap-3"
            onSubmit={(e) => handleLogin(e)}
          >
            <Input
              label="Email Address"
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="underlined"
            />
            <div className="flex items-center justify-between px-1 py-2">
              {/* <Checkbox name="remember" size="sm">
                Remember for 15 days
              </Checkbox> */}
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button
              color="primary"
              type="submit"
            >
              Log In
            </Button>
          </form>

          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href="/signup" size="sm">
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

      {/* Error Modal */}
      <Modal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Login Error</ModalHeader>
          <ModalBody>
            <p>{errorModalMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsErrorModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
