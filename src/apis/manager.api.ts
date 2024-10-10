import http from "@/utils/https";

export interface AccountInfo {
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

interface AccountResponse {
  $id: string;
  $values: AccountInfo[];
}

export const getAccountInfo = async (): Promise<AccountInfo[]> => {
  const response = await http.get<AccountResponse>('Accounts');
  return response.data.$values || [];
}

// ... existing code ...