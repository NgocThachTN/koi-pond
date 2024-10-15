import http from "@/utils/https"


interface LoginResType {
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
  accountId: number;
  name: string;
  phoneNumber: string;
  address: string;
  userName: string;
  email: string;
  roleId: number;
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

export interface UserRequest {
  $id: string;
  users: {
    $id: string;
    $values: Array<{
      $id: string;
      address: string;
      email: string;
      name: string;
      password: string;
      phoneNumber: string;
      roleId: number;
      userName: string;
    }>;
  };
  designs: {
    $id: string;
    $values: Array<{
      constructionTypeName: string;
      designName: string;
      designSize: string;
      designPrice: number;
      designImage: string;
    }>;
  };
  samples: {
    $id: string;
    $values: Array<{
      constructionTypeName: string;
      sampleName: string;
      sampleSize: string;
      samplePrice: number;
      sampleImage: string;
    }>;
  };
  requestName: string;
  description: string;
}

export const getUserRequestsApi = (email: string): Promise<UserRequest[]> => {
  return http.get<{ $id: string, $values: UserRequest[] }>(`Requests`)
    .then(response => {
      console.log('API response:', response.data); // Log the entire response
      return response.data.$values || [];
    });
}

interface ContractByRequestDesignType {
  requests: Array<{
    users: Array<{
      name: string;
      phoneNumber: string;
      address: string;
      userName: string;
      email: string;
      password: string;
      roleId: number;
    }>;
    designs: Array<{
      constructionTypeName: string;
      designName: string;
      designSize: string;
      designPrice: number;
      designImage: string;
    }>;
    requestName: string;
    description: string;
  }>;
  contractName: string;
  contractStartDate: string;
  contractEndDate: string;
  status: string;
  description: string;
}

interface ContractResponseType {
  success: boolean;
  message: string;
  contractId?: string;
  // Add any other fields that the API might return
}

export const createContractByRequestDesignApi = (contractData: ContractByRequestDesignType) => {
  return http.post<ContractResponseType>('Contracts/ByRequestDesign', contractData);
}

interface ContractBySampleDesignType {
  requests: Array<{
    users: Array<{
      name: string;
      phoneNumber: string;
      address: string;
      userName: string;
      email: string;
      password: string;
      roleId: number;
    }>;
    designs: Array<{
      constructionTypeName: string;
      designName: string;
      designSize: string;
      designPrice: number;
      designImage: string;
    }>;
    samples: Array<{
      constructionTypeName: string;
      sampleName: string;
      sampleSize: string;
      samplePrice: number;
      sampleImage: string;
    }>;
    requestName: string;
    description: string;
  }>;
  contractName: string;
  contractStartDate: string;
  contractEndDate: string;
  status: string;
  description: string;
}

interface ContractResponseType {
  success: boolean;
  message: string;
  contractId?: string;
  // Add any other fields that the API might return
}

export const createContractBySampleDesignApi = (contractData: ContractBySampleDesignType) => {
  return http.post<ContractResponseType>('Contracts/BySampleDesign', contractData);
}

export interface Contract {
  requests: Array<{
    users: Array<{
      name: string;
      phoneNumber: string;
      address: string;
      userName: string;
      email: string;
      password: string;
      roleId: number;
    }>;
    designs: Array<{
      constructionTypeName: string;
      designName: string;
      designSize: string;
      designPrice: number;
      designImage: string;
    }>;
    samples: Array<{
      constructionTypeName: string;
      sampleName: string;
      sampleSize: string;
      samplePrice: number;
      sampleImage: string;
    }>;
    requestName: string;
    description: string;
  }>;
  contractName: string;
  contractStartDate: string;
  contractEndDate: string;
  status: string;
  description: string;
}

export const getContractsApi = () => {
  return http.get<Contract[]>('Contracts');
}

interface UpdateContractStatusType {
  contractId: string;
  newStatus: string;
}

interface UpdateContractStatusResponseType {
  success: boolean;
  message: string;
}

export const updateContractStatusApi = (updateData: UpdateContractStatusType) => {
  return http.put<UpdateContractStatusResponseType>(`Contracts/${updateData.contractId}/status`, {
    status: updateData.newStatus
  });
}

export interface MaintenanceRequest {
  $id: string;
  requests: {
    $id: string;
    $values: Array<{
      $id: string;
      users: {
        $id: string;
        $values: Array<{
          $id: string;
          userId: number;
          accountId: number;
          name: string;
          phoneNumber: string;
          address: string;
          userName: string;
          email: string;
          password: string;
          roleId: number;
        }>;
      };
      designs: {
        $id: string;
        $values: Array<{
          designId: number;
          designName: string;
          designSize: string;
          designPrice: number;
          designImage: string;
        }>;
      };
      samples: {
        $id: string;
        $values: Array<{
          sampleId: number;
          sampleName: string;
          sampleSize: string;
          samplePrice: number;
          sampleImage: string;
        }>;
      };
      requestId: number;
      requestName: string;
      description: string;
    }>;
  };
  maintenance: {
    $id: string;
    $values: Array<{
      maintencaceName: string;
    }>;
  };
  maintenanceRequestId: number;
  maintenanceRequestStartDate: string;
  maintenanceRequestEndDate: string;
  status: string;
}

export const getMaintenanceRequestsApi = () => {
  return http.get<{ data: { $id: string, $values: MaintenanceRequest[] } }>('MaintenanceRequests');
}