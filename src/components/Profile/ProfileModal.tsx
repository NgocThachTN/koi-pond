import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Card,
  CardBody,
  CardFooter,
  Image,
  Avatar,
  Button,
  Chip,
  Input,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        <ModalBody className="p-0">
          <Card className="border-none bg-background/60 dark:bg-default-100/50">
            <CardBody className="p-0">
              <div className="relative h-[200px]">
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full object-cover"
                  src="https://nextui.org/images/card-example-4.jpeg"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black/80 via-black/20" />
              </div>
              <div className="px-6 py-4">
                <div className="flex">
                  {/* Profile Information */}
                  <div className="flex-1">
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <Avatar
                            isBordered
                            color="default"
                            src="https://i.pinimg.com/564x/14/8d/0e/148d0e0f3a55b0c93bf04d85b6f9e3e9.jpg"
                            className="w-24 h-24 text-large"
                          />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-large font-semibold leading-none text-default-600">Saito Asuka</h4>
                            <h5 className="text-small tracking-tight text-default-400">@saitoasuka</h5>
                            <div className="flex gap-1 mt-2">
                              <Chip size="sm" variant="flat" color="primary">Pro Member</Chip>
                              <Chip size="sm" variant="flat" color="secondary">Verified</Chip>
                            </div>
                          </div>
                        </div>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly variant="light" className="text-default-900/60 data-[hover]:bg-foreground/10">
                              <Icon icon="mdi:dots-vertical" width={24} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Profile actions">
                            <DropdownItem key="edit" onPress={() => setIsEditing(true)}>
                              Edit Profile
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-medium font-semibold">About</h6>
                        <p className="text-small text-default-500">
                          {/* About content */}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-medium font-semibold">Contact Information</h6>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:email-outline" className="text-default-500" width={20} />
                            <p className="text-small text-default-500">saito.asuka@example.com</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:phone-outline" className="text-default-500" width={20} />
                            <p className="text-small text-default-500">+81 90-1234-5678</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="mdi:map-marker-outline" className="text-default-500" width={20} />
                            <p className="text-small text-default-500">Tokyo, Japan</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Profile */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "50%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 ml-4 border-l border-gray-300 dark:border-gray-600 pl-4"
                      >
                        <h4 className="text-large font-semibold mb-4">Edit Profile</h4>
                        <div className="flex flex-col gap-4">
                          <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            defaultValue="Saito Asuka"
                          />
                          <Input
                            label="Username"
                            placeholder="Enter your username"
                            defaultValue="saitoasuka"
                          />
                          <Input
                            label="Email"
                            placeholder="Enter your email"
                            defaultValue="saito.asuka@example.com"
                          />
                          <Input
                            label="Phone"
                            placeholder="Enter your phone number"
                            defaultValue="+81 90-1234-5678"
                          />
                          <Input
                            label="Location"
                            placeholder="Enter your location"
                            defaultValue="Tokyo, Japan"
                          />
                          <Textarea
                            label="About"
                            placeholder="Tell us about yourself"
                            defaultValue=""
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardBody>
            <CardFooter className="justify-end gap-2 px-6 py-4">
              <Button variant="flat" color="danger" onPress={onClose}>
                Close
              </Button>
              {isEditing && (
                <Button color="primary" onPress={() => setIsEditing(false)}>
                  Save Changes
                </Button>
              )}
            </CardFooter>
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};