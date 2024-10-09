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

interface DesignRequestType {
  user: {
    name: string;
    phoneNumber: string;
    address: string;
    userName: string;
    email: string;
  };
  requestName: string;
  description: string;
  isDesignSelected: boolean;
  design: {
    constructionTypeName: string;
    designName: string;
    designSize: string;
    designPrice: number;
    designImage: string;
  };
}

interface DesignRequestResType {
  // Định nghĩa kiểu dữ liệu trả về tùy thuộc vào API của bạn
  success: boolean;
  message: string;
  // Thêm các trường khác nếu cần
}

export const sendDesignRequestApi = (requestData: DesignRequestType) => {
  return http.post<DesignRequestResType>('Requests/ByDesign', requestData);
}

interface SampleRequestType {
  user: {
    name: string;
    phoneNumber: string;
    address: string;
    userName: string;
    email: string;
  };
  requestName: string;
  description: string;
  isSampleSelected: boolean;
  sample: {
    constructionTypeName: string;
    sampleName: string;
    sampleSize: string;
    samplePrice: number;
    sampleImage: string;
  };
}

interface SampleRequestResType {
  success: boolean;
  message: string;
  // Add other fields if needed
}

export const sendSampleRequestApi = (requestData: SampleRequestType) => {
  return http.post<SampleRequestResType>('Requests/BySample', requestData);
}




