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

export interface AccountInfoWithId extends AccountInfo {
  accountId: number;
}

export interface AccountInfoArray {
  accountInfo: AccountInfoWithId[];
}

interface AccountResponse {
  $id: string;
  $values: AccountInfo[];
}

export const getAccountInfo = async (): Promise<AccountInfo[]> => {
  const response = await http.get<AccountResponse>('Accounts');
  return response.data.$values || [];
}

export interface UpdateAccountInfo {
  $id: string;
  accountId: number;
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

export const updateAccountInfo = async (id: number, accountInfo: UpdateAccountInfo): Promise<void> => {
  await http.put(`Accounts/${id}`, accountInfo);
}

export const deleteAccountInfo = async (id: number): Promise<void> => {
  await http.delete(`Accounts/${id}`);
}

