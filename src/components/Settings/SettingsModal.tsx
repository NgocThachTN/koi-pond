import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
} from "@nextui-org/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log("Changing password");
  };

  const handleChangeEmail = () => {
    // Implement email change logic here
    console.log("Changing email");
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      classNames={{
        body: "bg-purple-100", // Thêm màu nền tím nhạt
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
        <ModalBody>
          <Tabs aria-label="Settings options">
            <Tab key="password" title="Change Password">
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
            </Tab>
            <Tab key="email" title="Change Email">
              <form onSubmit={(e) => { e.preventDefault(); handleChangeEmail(); }}>
                <Input
                  label="New Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4"
                />
                <Button color="secondary" type="submit">
                  Change Email
                </Button>
              </form>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};