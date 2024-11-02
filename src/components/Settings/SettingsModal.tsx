import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { updateAccountInfo, UpdateAccountInfo } from "@/apis/manager.api";
import { getUserInfoApi } from "@/apis/user.api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserInfo {
  accountId: number;
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen]);

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfoApi();
      if (response.data) {
        if (Array.isArray(response.data.$values)) {
          const loggedInUserEmail = localStorage.getItem('userEmail');
          const user = response.data.$values.find((u: UserInfo) => u.email === loggedInUserEmail);
          if (user) {
            setUserInfo(user);
          } else {
            console.error('User not found in the response');
          }
        } else if (typeof response.data === 'object') {
          setUserInfo(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } else {
        console.error('No data in response');
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!userInfo) return;
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (currentPassword !== userInfo.password) {
      setError("Current password is incorrect");
      return;
    }
    try {
      const updatedInfo: UpdateAccountInfo = {
        $id: userInfo.accountId.toString(),
        accountId: userInfo.accountId,
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        userName: userInfo.userName,
        email: userInfo.email,
        password: newPassword,
        roleId: userInfo.roleId,
        status: userInfo.status

      };
      await updateAccountInfo(userInfo.accountId, updatedInfo);
      console.log("Password changed successfully");
      setError("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to change password. Please try again.");
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="2xl"
        classNames={{
          base: "bg-content1 dark:bg-content1",
          header: "border-b border-divider",
          footer: "border-t border-divider",
          closeButton: "hover:bg-default-300/50 active:bg-default-200/50",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
          <ModalBody>
            <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mb-4"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4"
              />
              <Button color="secondary" type="submit">
                Change Password
              </Button>
            </form>
            {error && <p className="text-danger mt-2">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Success</ModalHeader>
          <ModalBody>
            <p>Password changed successfully!</p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={handleSuccessModalClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};