"use client";
import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import DefaultManagerLayout from "@/layouts/defaultmanager";
import Dashboard from "./dashbroad/Dashbroad";


export default function ManagerPage() {
  return (
    <DefaultManagerLayout>
      <Dashboard/>
      <Outlet />
    </DefaultManagerLayout>
  );
}
