"use client";
import React from "react";
import DefaultManagerLayout from "@/layouts/defaultmanager";
import Dashboard from "@/pages/Manager/dashbroad/Dashbroad";

export default function ManagerPage() {
  return (
    <DefaultManagerLayout>
      <Dashboard />
    </DefaultManagerLayout>
  );
}
