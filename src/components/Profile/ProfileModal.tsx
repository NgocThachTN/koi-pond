import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardFooter,
  Image,
  Avatar,
  Button,
  Chip,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { getUserInfoApi } from '@/apis/user.api';
import axios from 'axios';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserInfo {
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
  email: string;
  roleId: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen]);

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfoApi();
      console.log('User info response:', response.data);
      if (response.data) {
        // Kiểm tra xem response.data có phải là một mảng không
        if (Array.isArray(response.data.$values)) {
          const loggedInUserEmail = localStorage.getItem('userEmail');
          const user = response.data.$values.find((u: UserInfo) => u.email === loggedInUserEmail);
          if (user) {
            setUserInfo(user);
          } else {
            console.error('User not found in the response');
          }
        } else if (typeof response.data === 'object') {
          // Nếu response.data là một object, giả sử đó là thông tin người dùng
          setUserInfo(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } else {
        console.error('No data in response');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    }
  };

  const openEditModal = () => {
    setIsEditing(true);
    onClose(); // Close the main profile modal
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Modal 
        isOpen={isOpen && !isEditing} 
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          <ModalBody className="p-0">
            {userInfo ? (
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
                            src="https://w7.pngwing.com/pngs/613/636/png-transparent-computer-icons-user-profile-male-avatar-avatar-heroes-logo-black-thumbnail.png"
                            className="w-24 h-24 text-large"
                          />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-large font-semibold leading-none text-default-600">{userInfo.name}</h4>
                            <h5 className="text-small tracking-tight text-default-400">@{userInfo.userName}</h5>
                            <div className="flex gap-1 mt-2">
                              <Chip size="sm" variant="flat" color="primary">Customer</Chip>
                              <Chip size="sm" variant="flat" color="secondary">Nogizaka46's Member</Chip>
                            </div>
                          </div>
                        </div>
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={openEditModal}
                          startContent={<Icon icon="mdi:pencil" width={20} />}
                        >
                          Edit Profile
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-medium font-semibold">About</h6>
                        <p className="text-small text-default-500">
                          {/* About content */}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-medium font-semibold">Contact Information</h6>
                        <div className="grid grid-cols-2 gap-4">
                          <Chip
                            startContent={<Icon icon="mdi:email-outline" className="text-primary" width={18} />}
                            variant="flat"
                            color="primary"
                          >
                            {userInfo.email}
                          </Chip>
                          <Chip
                            startContent={<Icon icon="mdi:phone-outline" className="text-secondary" width={18} />}
                            variant="flat"
                            color="secondary"
                          >
                            {userInfo.phoneNumber}
                          </Chip>
                          <Chip
                            startContent={<Icon icon="mdi:map-marker-outline" className="text-success" width={18} />}
                            variant="flat"
                            color="success"
                          >
                            {userInfo.address}
                          </Chip>
                          <Chip
                            startContent={<Icon icon="mdi:web" className="text-warning" width={18} />}
                            variant="flat"
                            color="warning"
                          >
                            koipondconstruction.com
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="justify-end gap-2 px-6 py-4">
                  <Button variant="flat" color="danger" onPress={onClose}>
                    Close
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div>Loading user information...</div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={closeEditModal}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-3 gap-4">
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
                  <Input
                    label="Website"
                    placeholder="Enter your website"
                    defaultValue=""
                  />
                </div>
                <Textarea
                  label="About"
                  placeholder="Tell us about yourself"
                  defaultValue=""
                  className="mt-4"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};