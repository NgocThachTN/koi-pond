import Head from "next/head";
import Sidebar from "@/components/Staff/Sidebar/sidebar";
import { items } from "@/components/Staff/Sidebar/sidebar-items";
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/apis/authen";
import { Avatar, Button, Spacer, ScrollShadow } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AcmeIcon } from "@/components/AcmeIcon";
import React, { useState, useEffect } from "react";
import { getUserInfoApi } from '@/apis/user.api';
import { useNavigate } from "react-router-dom";

interface UserInfo {
    name: string;
    phoneNumber: string;
    address: string;
    userName: string;
    email: string;
    roleId: number;
}

const getRoleName = (roleId: number | undefined) => {
    switch (roleId) {
        case 1:
            return "Customer";
        case 2:
            return "Manager";
        case 3:
            return "Staff";
        default:
            return "Unknown Role";
    }
};

export default function DefaultStaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState("dashboard");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfoApi();
            if (response.data) {
                if (Array.isArray(response.data.$values)) {
                    const loggedInUserEmail = localStorage.getItem('userEmail');
                    const user = response.data.$values.find((u: UserInfo) => u.email === loggedInUserEmail);
                    if (user) {
                        setUserInfo(user);
                    }
                } else if (typeof response.data === 'object') {
                    setUserInfo(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Head>
                <title>Koi Pond Management - Staff</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Koi Pond Management Staff Dashboard" />
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
                            <p className="text-small font-medium text-default-600">{userInfo?.name || 'Unknown User'}</p>
                            <p className="text-tiny text-default-400">{getRoleName(userInfo?.roleId)}</p>
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
