"use client";

import React, { useState } from "react";
import {Avatar, Button, Card, CardBody, CardFooter, ScrollShadow, Spacer} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "@/components/AcmeIcon";
import {items} from "@/components/Admin/Sidebar/sidebar-items";

import Sidebar from "@/components/Admin/Sidebar/sidebar";
import {ThemeSwitch} from "@/components/theme-switch"; // Add this import
import {useAuth} from "@/apis/authen"; // Add this import

import Dashboard from "@/pages/Manager/dashbroad/Dashbroad";


export default function Component() {
  const { logout } = useAuth(); // Add this line to get the logout function
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <Dashboard />;
      default:
        return <div>Content for {selectedKey}</div>;
    }
  };

  return (
    <div className="flex h-dvh">
      <div className="relative flex h-full w-72 flex-none flex-col border-r-small border-divider p-6">
        {/* Sidebar content remains the same */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              <AcmeIcon className="text-background" />
            </div>
            <span className="text-small font-bold ">KoiPond Management</span>
          </div>
          <ThemeSwitch />
        </div>
        <Spacer y={12} />
        <div className="flex items-center gap-3 px-4">
          <Avatar isBordered size="sm" src="https://i.pinimg.com/736x/ea/34/21/ea342127be35831759fcecf5d54af59f.jpg" />
          <div className="flex flex-col">
            <p className="text-small font-medium text-default-600">Saito Asuka</p>
            <p className="text-tiny text-default-400">Manager</p>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar 
            defaultSelectedKey={selectedKey} 
            items={items} 
            onSelectionChange={(key) => setSelectedKey(key as string)}
          />
        </ScrollShadow>
        <div className="mt-auto flex flex-col">
          <Button
            fullWidth
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
            }
            variant="light"
          >
            Help & Information
          </Button>
          <Button
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon
                className="rotate-180 text-default-500"
                icon="solar:minus-circle-line-duotone"
                width={24}
              />
            }
            variant="light"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
      <div className="flex-grow p-6">
        {renderContent()}
      </div>
    </div>
  );
}
