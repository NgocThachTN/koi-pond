import React from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';

const MaintenanceStaffManagement: React.FC = () => {
  return (
    <DefaultStaffLayout>
      <div>
        <h1>Maintenance Management</h1>
        <p>Manage maintenance requests here</p>
        {/* Add maintenance request management functionality here */}
      </div>
    </DefaultStaffLayout>
  );
};

export default MaintenanceStaffManagement;