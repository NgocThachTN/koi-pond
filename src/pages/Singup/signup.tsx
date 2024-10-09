"use client";

import React, { useState } from "react";
import { Button, Input, Link, Divider, User, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon";
import { registerApi } from "@/apis/user.api";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "", // Added email field
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isAgreed) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    try {
      const response = await registerApi({
        username: formData.username,
        password: formData.password,
        email: formData.email, // Include email in the API call
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        roleId: 1 // Assuming default role is 1, adjust as needed
      });
      console.log("Registration successful:", response);
      onOpen(); // Open the success modal
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    }
  };

  const handleSuccessModalClose = () => {
    onClose();
    navigate('/login');
  };

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

          <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Full Name"
              name="name"
              placeholder="Enter your Full Name"
              type="text"
              variant="underlined"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              isRequired
              label="Username"
              name="username"
              placeholder="Enter your username"
              type="text"
              variant="underlined"
              value={formData.username}
              onChange={handleInputChange}
            />
            <Input
              isRequired
              label="Email"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="underlined"
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
            />
            <Input
              isRequired
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={isVisible ? "text" : "password"}
              variant="underlined"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Input
              isRequired
              label="Address"
              name="address"
              placeholder="Enter your address"
              type="text"
              variant="underlined"
              value={formData.address}
              onChange={handleInputChange}
            />
            <Input
              isRequired
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              type="tel"
              variant="underlined"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <Checkbox 
              isRequired 
              className="py-4" 
              size="sm"
              isSelected={isAgreed}
              onValueChange={setIsAgreed}
            >
              I agree with the&nbsp;
              <Link href="#" size="sm">
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link href="#" size="sm">
                Privacy Policy
              </Link>
            </Checkbox>
            {error && <p className="text-red-500 text-sm">{error}</p>}
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

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleSuccessModalClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Registration Successful</ModalHeader>
          <ModalBody>
            <p>Your account has been created successfully. You will be redirected to the login page.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleSuccessModalClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}