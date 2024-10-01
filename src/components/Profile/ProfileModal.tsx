import React from "react";
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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
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
                    <Button isIconOnly variant="light" className="text-default-900/60 data-[hover]:bg-foreground/10">
                      <Icon icon="mdi:dots-vertical" width={24} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-small text-default-500">Posts</p>
                      <p className="text-large font-semibold">256</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-small text-default-500">Followers</p>
                      <p className="text-large font-semibold">1.2M</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-small text-default-500">Following</p>
                      <p className="text-large font-semibold">345</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-small text-default-500">Joined</p>
                      <p className="text-large font-semibold">Jan 2020</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h6 className="text-medium font-semibold">About</h6>
                    <p className="text-small text-default-500">
                      Japanese actress and model. Former member of Nogizaka46. Known for her roles in various TV dramas and films.
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
            </CardBody>
            <CardFooter className="justify-end gap-2 px-6 py-4">
              <Button variant="flat" color="danger" onPress={onClose}>
                Close
              </Button>
              <Button color="primary">
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};