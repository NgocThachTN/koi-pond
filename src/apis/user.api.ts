import http from "@/utils/https"


interface LoginResType{
    token: string,
    role: string,
    email: string,
    userName: string, // Change this line from fullName to userName
}

export const loginApi = (email: string, password: string) => {
  return http.post<LoginResType>('Auth/login', { 
    email: email,
    password: password,
    
  }) 
}

interface RegisterReqType {
  username: string;
  password: string;
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  roleId: number;
}

interface RegisterResType {
  success: boolean;
  message: string;
  userId?: string;
}

export const registerApi = (userData: RegisterReqType) => {
  return http.post<RegisterResType>('Auth/signup', userData);
}

interface UserInfoType {
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
}

export const getUserInfoApi = () => {
  return http.get<UserInfoType>('Accounts');
}




