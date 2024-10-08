import http from "@/utils/https"


interface LoginResType{
    token: string,
    role: string,
    email: string,
    userName: string, // Change this line from fullName to userName
}

export const loginApi = (email: string, password: string) => {
  return http.post<LoginResType>('Authenticate/login', { 
    email: email,
    password: password,
    
  }) 
}

interface RegisterReqType {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  return http.post<RegisterResType>('Authenticate/signup', userData);
}






