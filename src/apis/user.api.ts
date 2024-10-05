import http from "@/utils/https"


interface LoginResType{
    token: string,
    role: string,
    email: string,

}
export const loginApi = (email: string, password: string) => {
  return http.post<LoginResType>('Authentication/login', { 
    email:email,
    password:password,
    
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
  // Define the response type here. For example:
  success: boolean;
  message: string;
  userId?: string;
}

export const registerApi = (userData: RegisterReqType) => {
  return http.post<RegisterResType>('Authentication/signup', userData);
}




