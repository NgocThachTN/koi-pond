"use client";
import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import DefaultStaffLayout from "@/layouts/defaultstaff";
import StaffDashboard from "./dashbroad/Dashbroad";


export default function StaffPage() {
  return (
    <DefaultStaffLayout>
      <StaffDashboard />
      <Outlet />
    </DefaultStaffLayout>
  );
}