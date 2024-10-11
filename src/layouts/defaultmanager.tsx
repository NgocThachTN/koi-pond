import Head from "next/head";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import { items } from "@/components/Admin/Sidebar/sidebar-items";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/apis/authen";
import { Avatar, Button, Spacer, ScrollShadow } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon";
import React, { useState } from "react";

export default function DefaultManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Head>
        <title>Koi Pond Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Koi Pond Management Dashboard" />
      </Head>
      <div className="flex h-dvh">
        <div className="relative flex h-full w-72 flex-none flex-col border-r-small border-divider p-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                <AcmeIcon className="text-background" />
              </div>
              <span className="text-small font-bold">KoiPond Management</span>
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
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </>
  );
}
