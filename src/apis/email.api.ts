import emailjs from '@emailjs/browser';

interface OrderData {
  requestName: string;
  isDesignSelected?: boolean;
  design?: {
    designName: string;
    designSize: string;
  };
  sample?: {
    sampleName: string;
    sampleSize: string;
  };
  description: string;
}

interface UserInfo {
  name: string;
  email: string;
}

interface CompletedOrderData {
  requestName: string;
  contractName: string;
  contractEndDate: string;
  userEmail: string;
  userName: string;
}

export const sendOrderConfirmationEmail = async (orderData: OrderData, userInfo: UserInfo) => {
  try {
    const templateParams = {
      to_name: userInfo.name,
      to_email: userInfo.email,  
      request_type: orderData.requestName,
      service_type: orderData.isDesignSelected ? 'Custom Design' : 'Sample Project',
      project_name: orderData.isDesignSelected ? orderData.design?.designName : orderData.sample?.sampleName,
      size: orderData.isDesignSelected ? orderData.design?.designSize : orderData.sample?.sampleSize,
      description: orderData.description
    };

    console.log('Sending email to:', templateParams.to_email); 

    const response = await emailjs.send(
      'service_h3akevw',//gmail
      'template_7fexlon', // order request confirmation template id
      templateParams,
      '40sTqab7Amz79_f3m'
    );

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendOrderCompletionEmail = async (orderData: CompletedOrderData) => {
  console.log('sendOrderCompletionEmail called with data:', orderData);
  try {
    const templateParams = {
      to_name: orderData.userName,
      to_email: orderData.userEmail,
      subject: `Order Completion Notification: ${orderData.contractName}`,
      request_name: orderData.requestName,
      contract_name: orderData.contractName,
      completion_date: new Date(orderData.contractEndDate).toLocaleDateString(),
    };

    console.log('Sending email with params:', templateParams);

    const response = await emailjs.send(
      'service_h3akevw',
      'template_437yj1g',//order completion template id
      templateParams,
      '40sTqab7Amz79_f3m'
    );

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};
