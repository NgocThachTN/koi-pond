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




