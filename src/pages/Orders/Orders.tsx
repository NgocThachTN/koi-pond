import React, { useEffect, useState, useCallback } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination, Avatar, Input, Select, SelectItem, Textarea, Tabs, Tab, Image } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import {
  getContractsApi,
  getUserRequestsApi,
  Contract,
  UserRequest,
  createMaintenanceRequestBySampleApi,
  createMaintenanceRequestByDesignApi,
  MaintenanceRequestBySampleType,
  MaintenanceRequestByDesignType,
  getMaintenanceRequestsApi,
  MaintenanceRequest,
  updateContractByRequestDesignApi,
  updateContractBySampleApi
} from '@/apis/user.api'
import { Divider } from "@nextui-org/react"
import { FaCheckCircle, FaComments, FaEnve, FaMapMarkerAltlope, FaLeaf, FaPhone, FaList, FaRuler, FaMapMarkerAlt, FaEnvelope, FaUser, FaFileContract, FaTools, FaHardHat, FaEdit } from 'react-icons/fa'
import { Progress } from "@nextui-org/react"
import { Link } from "@nextui-org/react"
import { format } from 'date-fns'
import { Chip } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react"
import { TitleManager } from '@/components/TitleManager'; // Add this import at the top of the file
import Chatbot from '@/components/Chatbot/Chatbot';
const statusColorMap: Record<string, "warning" | "primary" | "success" | "danger"> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
  cancelled: "danger",
};

const formatMessageContent = (content: string) => {
  try {
    // Kiểm tra xem content có phải JSON string không
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      const parsedContent = JSON.parse(content);
      return {
        text: parsedContent.text || '',
        images: parsedContent.imageUrl ? [parsedContent.imageUrl] : []
      };
    }

    // Nếu không phải JSON, xử lý như cũ
    const firebaseStorageRegex = /https:\/\/firebasestorage\.googleapis\.com\/.*?\.(?:jpg|jpeg|png|gif)(\?[^\s]+)?/g;
    const pdfRegex = /https:\/\/firebasestorage\.googleapis\.com\/.*?\.pdf(\?[^\s]+)?/g;

    const images = content.match(firebaseStorageRegex) || [];

    let textContent = content
      .replace(firebaseStorageRegex, '')
      .replace(/\[img\]/g, '')
      .replace(/🖼️/g, '')
      .replace(/📷/g, '')
      .replace(/\s*\[object Object\]\s*/g, '')
      .replace(/\s*\[object HTMLImageElement\]\s*/g, '')
      .replace(/data:image\/[^"')\s]+/g, '')
      .replace(/📎/g, '')
      .replace(/\s*\[.*?\]\s*/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\uFFFD/g, '')
      .replace(/\u{1F4CE}/gu, '')
      .replace(/\u{1F4F7}/gu, '')
      .replace(/\u{1F5BC}/gu, '')
      .trim();

    return {
      text: textContent.trim(),
      images: images
    };
  } catch (error) {
    console.error('Error parsing message content:', error);
    return {
      text: content,
      images: []
    };
  }
};

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div
      className="text-sm break-words"
      dangerouslySetInnerHTML={{
        __html: formatMessageContent(content.replace(/\[.*?\] .*?: /g, ''))
      }}
    />
  );
};

const OrdersPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const rowsPerPage = 10
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure()
  const [selectedItem, setSelectedItem] = React.useState<Contract | UserRequest | null>(null)
  const [selectedService, setSelectedService] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [newProgressUpdate, setNewProgressUpdate] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [chatMessages, setChatMessages] = useState<{ [key: number]: any[] }>({});
  const [pollingInterval, setPollingInterval] = useState(5000); // Start with 5 seconds
  const [progressDescriptionModalOpen, setProgressDescriptionModalOpen] = useState(false);
  const [maintenanceProgressModalOpen, setMaintenanceProgressModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedContractForFeedback, setSelectedContractForFeedback] = useState<Contract | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const email = localStorage.getItem('userEmail')
        setUserEmail(email)
        if (!email) {
          setError('User email not found. Please log in again.')
          return
        }

        const [contractsResponse, requestsResponse, maintenanceResponse] = await Promise.all([
          getContractsApi(),
          getUserRequestsApi(email),
          getMaintenanceRequestsApi()
        ])

        if (contractsResponse.data && contractsResponse.data.$values) {
          const userContracts = contractsResponse.data.$values.filter((contract: Contract) =>
            contract.requests.$values.some(request =>
              request.users.$values.some(user => user.email === email)
            )
          )
          setContracts(userContracts)
        }

        if (requestsResponse) {
          const userRequests = requestsResponse.filter((request: UserRequest) =>
            request.users.$values.some(user => user.email === email)
          )
          setRequests(userRequests)
        }

        if (maintenanceResponse.data && maintenanceResponse.data.$values) {
          console.log('Maintenance Requests:', maintenanceResponse.data.$values)
          setMaintenanceRequests(maintenanceResponse.data.$values)
        } else {
          console.log('No maintenance requests found or unexpected data structure')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to fetch data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const allItems = React.useMemo(() => {
    // Create a Set of requestIds that are associated with contracts
    const contractRequestIds = new Set(
      contracts.flatMap(contract =>
        contract.requests.$values.map(request => request.requestId)
      )
    );

    // Map contract items
    const contractItems = contracts.flatMap(contract =>
      contract.requests.$values.map(request => ({
        ...request,
        contractStatus: contract.status,
        hasContract: true,
        contractName: contract.contractName,
        contractId: contract.contractId,
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
        contractDescription: contract.description,
        contructionProgress: contract.contructionProgress,
        paymentStatus: contract.paymentStatus,
        progressDescription: contract.progressDescription,
      }))
    );

    // Filter standalone requests to exclude those that now have contracts
    const standaloneRequests = requests
      .filter(request => !contractRequestIds.has(request.requestId))
      .map(request => ({
        ...request,
        contractStatus: 'Pending',
        hasContract: false,
        contractName: 'N/A',
        contractId: null,
        contractStartDate: null,
        contractEndDate: null,
      }));

    return [...contractItems, ...standaloneRequests];
  }, [contracts, requests]);

  const pages = Math.ceil(allItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return allItems.slice(start, end)
  }, [page, allItems])

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "requestName":
        return item.requestName
      case "type":
        if (item.designs?.$values?.[0]?.designName) {
          return 'Design'
        } else if (item.samples?.$values?.[0]?.sampleName) {
          return 'Sample'
        } else {
          return 'N/A'
        }
      case "status":
        const status = item.hasContract ? (item.contractStatus || 'pending').toLowerCase() : 'pending';
        return (
          <Chip
            color={statusColorMap[status] || "warning"}
            variant="flat"
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Chip>
        );
      case "description":
        const originalDescription = item.description.split(/\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\]\sCustomer:\s/)[0];
        return originalDescription || 'N/A';
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedItem(item)
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      case "maintenance":
        return item.contractStatus === 'Completed' ? (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedItem(item)
            onMaintenanceOpen()
          }}>
            Maintenance
          </Button>
        ) : null
      case "feedback":
        return item.contractStatus === 'Completed' ? (
          <Button
            color="primary"
            variant="flat"
            className="w-full"
            onPress={() => {
              // Tìm contract tương ứng từ danh sách contracts
              const contract = contracts.find(c => c.contractId === item.contractId);
              setSelectedContractForFeedback(contract || item);

              // Lấy rating từ feedback hiện có
              const existingRating = contract?.feedback?.match(/Rating: (\d)\/5 stars/)?.[1];
              setFeedbackRating(existingRating ? parseInt(existingRating) : 0);

              setIsFeedbackModalOpen(true);
            }}
            startContent={<FaEdit />}
          >
            {item.feedback ? 'Edit Feedback' : 'Add Feedback'}
          </Button>
        ) : null
      default:
        return 'N/A'
    }
  }, [onDetailsOpen, onMaintenanceOpen, contracts])

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem || !selectedService) return

    setIsSubmitting(true)

    const isDesignRequest = selectedItem.designs && selectedItem.designs.$values.length > 0

    const maintenanceRequestData = {
      requests: [{
        users: [{
          userId: selectedItem.users.$values[0].userId,
          accountId: selectedItem.users.$values[0].accountId,
          name: selectedItem.users.$values[0].name,
          phoneNumber: selectedItem.users.$values[0].phoneNumber,
          address: selectedItem.users.$values[0].address,
          userName: selectedItem.users.$values[0].userName,
          email: selectedItem.users.$values[0].email,
          password: "", // Don't send the password
          roleId: selectedItem.users.$values[0].roleId
        }],
        requestId: selectedItem.requestId,
        requestName: selectedItem.requestName,
        description: selectedItem.description
      }],
      maintenance: [{
        maintencaceName: selectedService
      }],
      maintenanceRequestId: 0, // This will be assigned by the server
      maintenanceRequestStartDate: new Date().toISOString(),
      maintenanceRequestEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: "Pending",
      progressMaintenanceDescription: "",
      paymentStatus: "Pending",
      progressMaintenance: ""
    }

    if (isDesignRequest) {
      (maintenanceRequestData.requests[0] as any).designs = selectedItem.designs.$values.map(design => ({
        designId: design.designId,
        designName: design.designName,
        designSize: design.designSize,
        designPrice: design.designPrice,
        designImage: design.designImage
      }))
    } else {
      (maintenanceRequestData.requests[0] as any).samples = selectedItem.samples.$values.map(sample => ({
        sampleId: sample.sampleId,
        sampleName: sample.sampleName,
        sampleSize: sample.sampleSize,
        samplePrice: sample.samplePrice,
        sampleImage: sample.sampleImage
      }))
    }

    try {
      let response
      if (isDesignRequest) {
        response = await createMaintenanceRequestByDesignApi(maintenanceRequestData as MaintenanceRequestByDesignType)
      } else {
        response = await createMaintenanceRequestBySampleApi(maintenanceRequestData as MaintenanceRequestBySampleType)
      }
      console.log('Maintenance request created:', response)
      setSubmitSuccess(true)
      setIsSuccessModalOpen(true)  // Open the success modal
      onMaintenanceClose()  // Close the maintenance request modal
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatProgressUpdates = (description: string) => {
    if (!description) return [];

    const lines = description.split('\n');

    return lines.map((line, index) => {
      const dateMatch = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?): (.*)/);
      if (dateMatch) {
        const [, timestamp, role, content] = dateMatch;
        const date = new Date(timestamp);
        const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss');
        return {
          id: index,
          sender: role,
          content: content,
          timestamp: formattedDate
        };
      }
      return null;
    }).filter(Boolean);
  };

  const fetchLatestUpdates = useCallback(async (contract: Contract) => {
    if (!contract) return;

    try {
      const response = await getContractsApi();
      const updatedContract = response.data.$values.find(
        (c: Contract) => c.contractId === contract.contractId
      );

      if (updatedContract && updatedContract.description !== contract.description) {
        const formattedMessages = formatProgressUpdates(updatedContract.description || '');
        setChatMessages(prev => ({
          ...prev,
          [contract.contractId]: formattedMessages
        }));
        setEditingContract(prevContract => ({
          ...prevContract!,
          contractDescription: updatedContract.description
        }));
        setPollingInterval(5000);
      } else {
        setPollingInterval(prev => Math.min(prev * 1.5, 60000));
      }
    } catch (err) {
      console.error("Error fetching latest updates:", err);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isEditContractOpen && editingContract) {
      intervalId = setInterval(() => fetchLatestUpdates(editingContract), pollingInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isEditContractOpen, editingContract, pollingInterval, fetchLatestUpdates]);

  const handleEditContractClick = (contract: Contract) => {
    const currentContract = contracts.find(c => c.contractId === contract.contractId);

    setEditingContract({
      ...contract,
      ...currentContract,
      status: currentContract?.status || contract.status,
      feedback: currentContract?.feedback || contract.feedback,
      link: currentContract?.link || contract.link,
    });

    // Parse và set tin nhắn từ progressDescription
    const messages = formatProgressUpdates(currentContract?.progressDescription || '');
    setChatMessages(prev => ({
      ...prev,
      [contract.contractId]: messages
    }));

    setIsEditContractOpen(true);
    fetchLatestUpdates(contract);
  };

  const handleFeedbackUpdate = (newFeedback: string) => {
    if (!selectedContractForFeedback) return;

    // Get current contract from the contracts list to ensure we have the latest data
    const currentContract = contracts.find(c => c.contractId === selectedContractForFeedback.contractId);

    setSelectedContractForFeedback(prev => ({
      ...prev!,
      ...currentContract, // Spread current contract data to preserve all fields
      feedback: newFeedback,
      status: currentContract?.status || prev?.status || 'Completed',
      link: currentContract?.link || prev?.link || '', // Use current contract link first
    }));
  };


  const handleEditContractSubmit = async () => {
    if (!editingContract) return;

    try {
      const isDesignRequest = editingContract.designs && editingContract.designs.$values && editingContract.designs.$values.length > 0;
      const updateFunction = isDesignRequest ? updateContractByRequestDesignApi : updateContractBySampleApi;

      const currentContract = contracts.find(c => c.contractId === editingContract.contractId);
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      let updatedDescription = editingContract.contractDescription || '';

      if (newProgressUpdate.trim()) {
        const newUpdate = `[${currentDate}] Customer: ${newProgressUpdate}`;
        updatedDescription = updatedDescription
          ? `${updatedDescription}\n\n${newUpdate}`
          : newUpdate;

        // Immediately update chat messages
        const newMessage = {
          id: chatMessages[editingContract.contractId]?.length || 0,
          sender: 'Customer',
          content: newProgressUpdate,
          timestamp: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
        };

        setChatMessages(prev => ({
          ...prev,
          [editingContract.contractId]: [
            ...(prev[editingContract.contractId] || []),
            newMessage
          ]
        }));
      }

      // Rest of the update logic...
      const updatePayload = {
        ...currentContract,
        ...editingContract,
        contractId: Number(editingContract.contractId),
        description: updatedDescription,
        status: currentContract?.status || editingContract.status || 'Completed',
        feedback: editingContract.feedback || currentContract?.feedback || '',
        link: currentContract?.link || editingContract.link || '',
        requests: [{
          requestId: editingContract.requestId,
          requestName: editingContract.requestName,
          description: editingContract.description.split('\n')[0] || '', // Use original description only
          users: editingContract.users.$values,
          designs: isDesignRequest ? editingContract.designs.$values : [],
          samples: !isDesignRequest ? editingContract.samples.$values : [],
        }]
      };

      const updatedContract = await updateFunction(updatePayload);
      setNewProgressUpdate('');

      // Update the editing contract
      setEditingContract(prev => ({
        ...prev!,
        ...currentContract,
        contractDescription: updatedDescription,
        status: currentContract?.status || prev?.status || 'Completed',
        feedback: prev?.feedback || currentContract?.feedback || '',
        link: currentContract?.link || prev?.link || '',
      }));

      // Update contracts list
      setContracts(prevContracts =>
        prevContracts.map(contract =>
          contract.contractId === editingContract.contractId
            ? {
              ...contract,
              ...currentContract,
              ...editingContract,
              description: updatedDescription,
              status: currentContract?.status || contract.status || 'Completed',
              feedback: editingContract.feedback || contract.feedback || '',
              link: currentContract?.link || contract.link || '',
            }
            : contract
        )
      );

    } catch (err) {
      console.error("Error updating contract:", err);
    }
  };


  const handleStatusChange = async (newStatus: string) => {
    if (!editingContract) {
      console.error("No contract is being edited");
      return;
    }

    try {
      const isDesignRequest = editingContract.designs && editingContract.designs.$values && editingContract.designs.$values.length > 0;
      const updateFunction = isDesignRequest ? updateContractByRequestDesignApi : updateContractBySampleApi;

      // Get current contract from the contracts list to ensure we have the latest data
      const currentContract = contracts.find(c => c.contractId === editingContract.contractId);

      const updatePayload = {
        ...currentContract, // Spread all current contract data first
        contractId: Number(editingContract.contractId),
        contractName: editingContract.contractName,
        contractStartDate: editingContract.contractStartDate,
        contractEndDate: editingContract.contractEndDate,
        status: newStatus,
        description: editingContract.contractDescription || '',
        link: currentContract?.link || '', // Preserve the existing link
        requests: [{
          requestId: editingContract.requestId,
          requestName: editingContract.requestName,
          description: editingContract.description,
          users: editingContract.users.$values,
          designs: isDesignRequest ? editingContract.designs.$values : [],
          samples: !isDesignRequest ? editingContract.samples.$values : [],
        }]
      };

      console.log("Update payload:", updatePayload);

      const updatedContract = await updateFunction(updatePayload);
      console.log("Contract updated successfully:", updatedContract);

      // Update the local state
      setEditingContract(prev => ({
        ...prev!,
        ...currentContract,
        status: newStatus,
        link: currentContract?.link || '', // Preserve the link in local state
      }));

      setIsEditContractOpen(false);
      await fetchContracts();
    } catch (err) {
      console.error("Error in handleStatusChange:", err);
    }
  };

  // Add this function to fetch contracts
  const fetchContracts = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const contractsResponse = await getContractsApi();
        if (contractsResponse.data && contractsResponse.data.$values) {
          const userContracts = contractsResponse.data.$values.filter((contract: Contract) =>
            contract.requests.$values.some(request =>
              request.users.$values.some(user => user.email === email)
            )
          );
          setContracts(userContracts);
        }
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    }
  };

  useEffect(() => {
    if (editingContract) {
      const ratingMatch = editingContract.feedback?.match(/Rating: (\d)\/5 stars/);
      setFeedbackRating(ratingMatch ? parseInt(ratingMatch[1]) : 0);
    }
  }, [editingContract]);

  // Thêm hàm xử lý cập nhật link nếu cần
  const handleLinkUpdate = (newLink: string) => {
    if (!editingContract) return;

    setEditingContract(prev => ({
      ...prev!,
      link: newLink,
      status: prev?.status || 'Completed', // Explicitly preserve status
      feedback: prev?.feedback || '', // Preserve feedback
    }));
  };

  useEffect(() => {
    if (selectedContractForFeedback) {
      const existingRating = selectedContractForFeedback.feedback?.match(/Rating: (\d)\/5 stars/)?.[1];
      setFeedbackRating(existingRating ? parseInt(existingRating) : 0);
    }
  }, [selectedContractForFeedback]);

  // Thêm hàm xử lý gửi tin nhắn mới
  const handleSendMessage = async () => {
    if (!editingContract || !newProgressUpdate.trim()) return;

    try {
      const timestamp = new Date().toISOString();
      const newMessage = `[${timestamp}] Customer: ${newProgressUpdate}`;

      // Lấy contract hiện tại
      const currentContract = contracts.find(c => c.contractId === editingContract.contractId);
      if (!currentContract) {
        console.error('Contract not found');
        return;
      }

      // Tạo progressDescription mới bằng cách thêm tin nhắn mới
      const updatedProgressDescription = currentContract.progressDescription
        ? `${currentContract.progressDescription}\n${newMessage}`
        : newMessage;

      const isDesignRequest = currentContract.requests.$values[0].designs?.$values?.length > 0;
      const updateFunction = isDesignRequest ? updateContractByRequestDesignApi : updateContractBySampleApi;

      // Chuẩn bị payload với đầy đủ thông tin
      const updatePayload = {
        ...currentContract,
        progressDescription: updatedProgressDescription,
        requests: [{
          ...currentContract.requests.$values[0],
          users: currentContract.requests.$values[0].users.$values,
          designs: isDesignRequest ? currentContract.requests.$values[0].designs.$values : [],
          samples: !isDesignRequest ? currentContract.requests.$values[0].samples.$values : []
        }]
      };

      // Gọi API cập nhật
      await updateFunction(updatePayload);

      // Cập nhật state local
      const formattedMessages = formatProgressUpdates(updatedProgressDescription);
      setChatMessages(prev => ({
        ...prev,
        [editingContract.contractId]: formattedMessages
      }));

      // Reset input
      setNewProgressUpdate('');

      // Cập nhật contracts list
      await fetchContracts();

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TitleManager title="Koi Pond Construction | Orders" />
      <NavbarUser />
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">My Koi Pond Construction Requests</h1>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p>Loading requests...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : allItems.length === 0 ? (
              <p>No requests found.</p>
            ) : (
              <>
                <Table aria-label="Koi Pond Construction Requests Table">
                  <TableHeader>
                    <TableColumn key="requestName">Request Name</TableColumn>
                    <TableColumn key="type">Type</TableColumn>
                    <TableColumn key="status">Status</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                    <TableColumn key="maintenance">Maintenance</TableColumn>
                    <TableColumn key="feedback">Feedback</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={`${item.requestName}-${index}`}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-small text-default-400">
                    Total {allItems.length} requests
                  </span>
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(newPage) => setPage(newPage)}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <Modal
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">Details</h2>
                </ModalHeader>
                <ModalBody>
                  {selectedItem && (
                    <Tabs aria-label="Request Details" color="primary" variant="underlined">
                      <Tab
                        key="overview"
                        title={
                          <div className="flex items-center space-x-2">
                            <FaUser />
                            <span>Overview</span>
                          </div>
                        }
                      >
                        <Card>
                          <CardBody>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Request Information</h3>
                                <p><strong>Name:</strong> {selectedItem.requestName}</p>
                                <p><strong>Type:</strong> {selectedItem.designs.$values.length > 0 ? 'Design' : 'Sample'}</p>
                                <p><strong>Size:</strong> {selectedItem.designs.$values[0]?.designSize || selectedItem.samples.$values[0]?.sampleSize}</p>
                                <p><strong>Price:</strong> ${selectedItem.designs.$values[0]?.designPrice || selectedItem.samples.$values[0]?.samplePrice}</p>
                                <p><strong>Description:</strong> {selectedItem.description}</p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2">User Information</h3>
                                {selectedItem.users.$values.map((user, userIndex) => (
                                  <div key={userIndex} className="flex items-start space-x-4">
                                    <Avatar name={user.name} size="lg" />
                                    <div>
                                      <p><strong>Name:</strong> {user.name}</p>
                                      <p><strong>Email:</strong> {user.email}</p>
                                      <p><strong>Phone:</strong> {user.phoneNumber}</p>
                                      <p><strong>Address:</strong> {user.address}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Tab>
                      {selectedItem.hasContract && (
                        <Tab
                          key="contract"
                          title={
                            <div className="flex items-center space-x-2">
                              <FaFileContract />
                              <span>Contract</span>
                            </div>
                          }
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <h3 className="text-lg font-semibold">Contract Details</h3>
                              </CardHeader>
                              <CardBody>
                                <div className="space-y-2">
                                  <p><strong>Contract Name:</strong> {selectedItem.contractName}</p>
                                  <p><strong>Status:</strong> {selectedItem.contractStatus}</p>
                                  <p><strong>Start Date:</strong> {new Date(selectedItem.contractStartDate).toLocaleDateString()}</p>
                                  <p><strong>End Date:</strong> {new Date(selectedItem.contractEndDate).toLocaleDateString()}</p>
                                  <Divider className="my-2" />
                                  <p><strong>Duration:</strong> {
                                    Math.ceil((new Date(selectedItem.contractEndDate).getTime() - new Date(selectedItem.contractStartDate).getTime()) / (1000 * 3600 * 24))
                                  } days</p>
                                </div>

                              </CardBody>
                            </Card>

                            {selectedItem.contractStatus !== 'Cancelled' && (
                              <Card>
                                <CardHeader className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Construction Progress</h3>
                                  <div className="flex items-center space-x-2">
                                    <FaHardHat className="text-yellow-500" />
                                    <span className="text-sm font-medium">{selectedItem.contractStatus}</span>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <Progress
                                    value={selectedItem.contractStatus === 'Completed' ? 100 : 50}
                                    color={selectedItem.contractStatus === 'Completed' ? "success" : "primary"}
                                    className="mb-4"
                                  />
                                  <Divider className="my-4" />
                                  <Button
                                    color="primary"
                                    onClick={() => handleEditContractClick(selectedItem)}
                                    className="w-full"
                                  >
                                    View Contract
                                  </Button>
                                </CardBody>
                              </Card>
                            )}
                          </div>
                        </Tab>
                      )}
                      {selectedItem.contractStatus === 'Completed' && (
                        <Tab
                          key="maintenance"
                          title={
                            <div className="flex items-center space-x-2">
                              <FaTools />
                              <span>Maintenance</span>
                            </div>
                          }
                        >
                          <Card>
                            <CardBody>
                              <h3 className="text-lg font-semibold mb-4">Maintenance Information</h3>
                              {maintenanceRequests.length > 0 ? (
                                maintenanceRequests.map((mr, index) => {
                                  const matchingRequest = mr.requests.$values.find(r =>
                                    r.requestId === selectedItem.requestId ||
                                    r.requestName === selectedItem.requestName
                                  );
                                  const matchingUser = matchingRequest?.users.$values.find(u => u.email === userEmail);

                                  if (matchingRequest && matchingUser) {
                                    return (
                                      <Card key={index} className="mb-4">
                                        <CardHeader>
                                          <h4 className="text-md font-semibold">Maintenance Request #{mr.maintenanceRequestId}</h4>
                                        </CardHeader>
                                        <CardBody>
                                          <div className="grid grid-cols-2 gap-4">
                                            <p><strong>Status:</strong> {mr.status}</p>
                                            <p><strong>Start Date:</strong> {new Date(mr.maintenanceRequestStartDate).toLocaleDateString()}</p>
                                            <p><strong>End Date:</strong> {new Date(mr.maintenanceRequestEndDate).toLocaleDateString()}</p>
                                          </div>
                                          <Divider className="my-4" />
                                          <h5 className="text-md font-semibold mb-2">Services:</h5>
                                          <ul className="list-disc pl-5">
                                            {mr.maintenance.$values.map((m, idx) => (
                                              <li key={idx}>{m.maintencaceName}</li>
                                            ))}
                                          </ul>

                                          <div className="mb-4">
                                            <Button
                                              onPress={() => {
                                                setEditingRequest(mr);
                                                setMaintenanceProgressModalOpen(true);
                                              }}
                                              variant="flat"
                                              className="w-full"
                                            >
                                              View Maintenance Progress
                                            </Button>
                                          </div>
                                          <Input
                                            label="Maintenance Progress"
                                            value={mr.progressMaintenance || 'Not available'}
                                            isReadOnly
                                            className="mb-4"
                                          />

                                          <Input
                                            label="Payment Status"
                                            value={mr.paymentStatus || 'Not available'}
                                            isReadOnly
                                            className="mb-4"
                                          />

                                        </CardBody>
                                      </Card>
                                    );
                                  }
                                  return null;
                                })
                              ) : (
                                <p>No maintenance requests found.</p>
                              )}
                              {maintenanceRequests.length > 0 &&
                                !maintenanceRequests.some(mr =>
                                  mr.requests.$values.some(r =>
                                    (r.requestId === selectedItem.requestId || r.requestName === selectedItem.requestName) &&
                                    r.users.$values.some(u => u.email === userEmail)
                                  ) &&
                                  mr.status === 'Completed'
                                ) && (
                                  <p>No completed maintenance requests found for this specific item and user.</p>
                                )}
                            </CardBody>
                          </Card>
                        </Tab>
                      )}
                    </Tabs>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isMaintenanceOpen}
          onClose={onMaintenanceClose}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <Card>
                  <CardHeader className="flex gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
                    <Avatar icon={<FaLeaf size={24} />} className="bg-violet-800" />
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold">Request a Quote</p>
                      <p className="text-small text-white/60">Fill in the details and we'll get back to you</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="p-8">
                    <form className="space-y-8" onSubmit={handleMaintenanceSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          variant="flat"
                          isReadOnly
                          value={selectedItem?.users.$values[0]?.name || ''}
                          startContent={<FaLeaf className="text-violet-500" />}
                        />
                        <Input
                          label="Email"
                          type="email"
                          variant="flat"
                          isReadOnly
                          value={selectedItem?.users.$values[0]?.email || ''}
                          startContent={<FaEnvelope className="text-violet-500" />}
                        />
                        <Input
                          label="Phone Number"
                          variant="flat"
                          isReadOnly
                          value={selectedItem?.users.$values[0]?.phoneNumber || ''}
                          startContent={<FaPhone className="text-violet-500" />}
                        />
                        <Input
                          label="Address"
                          variant="flat"
                          isReadOnly
                          value={selectedItem?.users.$values[0]?.address || ''}
                          startContent={<FaMapMarkerAlt className="text-violet-500" />}
                        />
                      </div>

                      <Select
                        label="Services"
                        placeholder="Choose the type of service"
                        variant="faded"
                        startContent={<FaList className="text-violet-500" />}
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        required
                      >
                        <SelectItem key="Pond Cleaning" value="Pond Cleaning">Pond Cleaning</SelectItem>
                        <SelectItem key="Waterfall Inspection" value="Waterfall Inspection">Waterfall Inspection</SelectItem>
                        <SelectItem key="Garden Pruning" value="Garden Pruning">Garden Pruning</SelectItem>
                        <SelectItem key="Patio Repair" value="Patio Repair">Patio Repair</SelectItem>
                        <SelectItem key="Bridge Repainting" value="Bridge Repainting">Bridge Repainting</SelectItem>
                        <SelectItem key="Fountain Cleaning" value="Fountain Cleaning">Fountain Cleaning</SelectItem>
                        <SelectItem key="Other Services" value="Other Services">Other Services</SelectItem>
                      </Select>

                      <Button
                        type="submit"
                        color="secondary"
                        className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        isLoading={isSubmitting}
                      >
                        Submit Quote Request
                      </Button>
                    </form>
                    <p className="text-sm text-violet-400 mt-6 text-center">*We typically respond within 24 business hours</p>
                  </CardBody>
                </Card>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Success Modal */}
        <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Request Submitted Successfully</ModalHeader>
                <ModalBody>
                  <div className="flex items-center gap-4">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                    <p>Your maintenance request has been submitted successfully!</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">We'll get back to you within 24 business hours.</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onPress={() => {
                    onClose()
                    setIsSuccessModalOpen(false)
                  }}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Edit Contract Modal */}
        <Modal
          isOpen={isEditContractOpen}
          onClose={() => setIsEditContractOpen(false)}
          size="5xl"
        >
          <ModalContent className="max-w-[1200px]">
            <ModalHeader className="flex flex-col gap-1">Edit Contract</ModalHeader>
            <ModalBody>
              {editingContract && (
                <div className="grid grid-cols-5 gap-6">
                  {/* Left column: Contract details */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Contract Details</h3>
                    <Input
                      label="Contract Name"
                      value={editingContract.contractName}
                      isReadOnly
                      className="mb-4"
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={format(new Date(editingContract.contractStartDate), 'yyyy-MM-dd')}
                      isReadOnly
                      className="mb-4"
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={format(new Date(editingContract.contractEndDate), 'yyyy-MM-dd')}
                      isReadOnly
                      className="mb-4"
                    />
                    <Input
                      label="Current Status"
                      value={editingContract.contractStatus}
                      isReadOnly
                      className="mb-4"
                    />
                    {editingContract.contractStatus === "Pending" && (
                      <div className="flex justify-between mb-4">
                        <Button
                          color="success"
                          auto
                          onPress={() => handleStatusChange("Processing")}
                        >
                          Agree
                        </Button>
                        <Button
                          color="danger"
                          auto
                          onPress={() => handleStatusChange("Cancelled")}
                        >
                          Disagree
                        </Button>
                      </div>
                    )}
                    <Input
                      label="Request Name"
                      value={editingContract.requestName}
                      isReadOnly
                      className="mb-4"
                    />
                    <Textarea
                      label="Request Description"
                      value={editingContract.description.split('\n')[0] || ''}
                      isReadOnly
                      className="mb-4"
                    />
                    <div className="mb-4">
                      <Button
                        onPress={() => setProgressDescriptionModalOpen(true)}
                        variant="flat"
                        className="w-full"
                      >
                        View Progress Description
                      </Button>
                    </div>
                    <Input
                      label="Construction Progress"
                      value={editingContract.contructionProgress || 'Not available'}
                      isReadOnly
                      className="mb-4"
                    />

                    <Input
                      label="Payment Status"
                      value={editingContract.paymentStatus || 'Not available'}
                      isReadOnly
                      className="mb-4"
                    />


                  </div>
                  {/* Right column: Progress updates */}
                  <div className="col-span-3 flex flex-col h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Progress Updates</h3>
                    <ScrollShadow className="flex-grow mb-4">
                      <div className="space-y-4">
                        {chatMessages[editingContract.contractId]?.map((message, index) => (
                          <div key={message.id} className={`flex ${message.sender === 'Customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'Customer' ? 'flex-row-reverse' : ''}`}>
                              <Avatar
                                icon={message.sender === 'Customer' ? <FaUser /> : <FaHardHat />}
                                classNames={{
                                  base: message.sender === 'Customer' ? "bg-blue-500" : "bg-green-500",
                                }}
                              />
                              <div className={`p-3 rounded-lg ${message.sender === 'Customer'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-black dark:bg-gray-700 dark:text-white'
                                }`}>
                                <p className="font-semibold text-sm">{message.sender}</p>
                                <div className="text-sm mt-1">
                                  {/* Hiển thị text */}
                                  {formatMessageContent(message.content).text && (
                                    <div className="whitespace-pre-wrap">
                                      {formatMessageContent(message.content).text}
                                    </div>
                                  )}

                                  {/* Hiển thị ảnh */}
                                  {formatMessageContent(message.content).images.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                      {formatMessageContent(message.content).images.map((imageUrl, imgIndex) => (
                                        <Image
                                          key={imgIndex}
                                          src={imageUrl}
                                          alt={`Progress Image ${imgIndex + 1}`}
                                          classNames={{
                                            img: "object-cover rounded-lg",
                                            wrapper: "w-full max-w-md",
                                          }}
                                          radius="lg"
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollShadow>
                    <Divider className="my-4" />
                    <div className="flex items-end gap-2">
                      <Textarea
                        label="New Message"
                        placeholder="Type your message..."
                        value={newProgressUpdate}
                        onChange={(e) => setNewProgressUpdate(e.target.value)}
                        className="flex-grow"
                      />
                      <Button color="primary" onPress={handleEditContractSubmit}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsEditContractOpen(false)}>
                Close
              </Button>
              <Button color="primary" onPress={handleEditContractSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Chatbot />
        <Modal
          isOpen={progressDescriptionModalOpen}
          onClose={() => setProgressDescriptionModalOpen(false)}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Construction Progress</h2>
                    <Chip
                      color={statusColorMap[editingContract?.contractStatus?.toLowerCase() || 'pending']}
                      variant="flat"
                    >
                      {editingContract?.contractStatus || 'Pending'}
                    </Chip>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-12 gap-4">
                    {/* Left Column - Progress Overview */}
                    <div className="col-span-3 space-y-4">
                      <Card>
                        <CardBody className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
                            <Progress
                              label="Construction Progress"
                              value={parseInt(editingContract?.contructionProgress || '0')}
                              color="primary"
                              showValueLabel={true}
                              className="mb-2"
                              size="lg"
                            />
                          </div>

                          <Divider />

                          <div>
                            <h4 className="text-sm font-medium mb-2">Project Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-default-500">Start Date:</span>
                                <span>{format(new Date(editingContract?.contractStartDate || ''), 'dd/MM/yyyy')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">End Date:</span>
                                <span>{format(new Date(editingContract?.contractEndDate || ''), 'dd/MM/yyyy')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">Payment Status:</span>
                                <Chip size="sm" variant="flat" color={editingContract?.paymentStatus === 'Completed' ? 'success' : 'warning'}>
                                  {editingContract?.paymentStatus || 'Pending'}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                    {/* Right Column - Timeline of Updates */}
                    <div className="col-span-9">
                      <h3 className="text-lg font-semibold mb-4 dark:text-white">Timeline of Updates</h3>
                      <ScrollShadow className="h-[400px]">
                        <div className="space-y-4">
                          {editingContract?.progressDescription?.split('\n').map((line, index) => {
                            const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?):(.*)/);
                            if (match) {
                              const [, timestamp, sender, content] = match;
                              const date = new Date(timestamp);
                              const formattedContent = formatMessageContent(content.trim());

                              return (
                                <Card key={index} className="w-full">
                                  <CardBody className="p-3">
                                    <div className="flex items-start gap-3">
                                      <Avatar
                                        icon={sender.trim() === 'Staff' ? <FaHardHat /> : <FaUser />}
                                        classNames={{
                                          base: sender.trim() === 'Staff' ? "bg-primary/10 text-primary" : "bg-default/10",
                                        }}
                                      />
                                      <div className="flex-grow space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">{sender.trim()}</span>
                                          <span className="text-xs text-default-400">
                                            {format(date, 'dd/MM/yyyy HH:mm')}
                                          </span>
                                        </div>

                                        {/* Text Content */}
                                        {formattedContent.text && (
                                          <div className="text-sm text-default-600">
                                            {formattedContent.text}
                                          </div>
                                        )}

                                        {/* Images */}
                                        {formattedContent.images.length > 0 && (
                                          <div className="grid grid-cols-1 gap-2 mt-2">
                                            {formattedContent.images.map((imageUrl, imgIndex) => (
                                              <Image
                                                key={imgIndex}
                                                src={imageUrl}
                                                alt={`Progress Image ${imgIndex + 1}`}
                                                classNames={{
                                                  img: "object-cover rounded-lg",
                                                  wrapper: "w-full max-w-md",
                                                }}
                                                radius="lg"
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </ScrollShadow>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={maintenanceProgressModalOpen}
          onClose={() => setMaintenanceProgressModalOpen(false)}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Maintenance Progress</h2>
                    <Chip
                      color={statusColorMap[editingRequest?.status?.toLowerCase() || 'pending']}
                      variant="flat"
                    >
                      {editingRequest?.status || 'Pending'}
                    </Chip>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-12 gap-4">
                    {/* Left Column - Progress Overview */}
                    <div className="col-span-3 space-y-4">
                      <Card>
                        <CardBody className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
                            <Progress
                              label="Maintenance Progress"
                              value={parseInt(editingRequest?.progressMaintenance || '0')}
                              color="primary"
                              showValueLabel={true}
                              className="mb-2"
                              size="lg"
                            />
                          </div>

                          <Divider />

                          <div>
                            <h4 className="text-sm font-medium mb-2">Maintenance Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-default-500">Start Date:</span>
                                <span>{format(new Date(editingRequest?.maintenanceRequestStartDate || ''), 'dd/MM/yyyy')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">End Date:</span>
                                <span>{format(new Date(editingRequest?.maintenanceRequestEndDate || ''), 'dd/MM/yyyy')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">Payment Status:</span>
                                <Chip size="sm" variant="flat" color={editingRequest?.paymentStatus === 'Completed' ? 'success' : 'warning'}>
                                  {editingRequest?.paymentStatus || 'Pending'}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                    {/* Right Column - Timeline of Updates */}
                    <div className="col-span-9">
                      <h3 className="text-lg font-semibold mb-4 dark:text-white">Timeline of Updates</h3>
                      <ScrollShadow className="h-[400px]">
                        <div className="space-y-4">
                          {editingRequest?.progressMaintenanceDescription?.split('\n').map((line, index) => {
                            const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?):(.*)/);
                            if (match) {
                              const [, timestamp, sender, content] = match;
                              const date = new Date(timestamp);
                              const formattedContent = formatMessageContent(content.trim());

                              return (
                                <Card key={index} className="w-full">
                                  <CardBody className="p-3">
                                    <div className="flex items-start gap-3">
                                      <Avatar
                                        icon={sender.trim() === 'Staff' ? <FaHardHat /> : <FaUser />}
                                        classNames={{
                                          base: sender.trim() === 'Staff' ? "bg-primary/10 text-primary" : "bg-default/10",
                                        }}
                                      />
                                      <div className="flex-grow space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">{sender.trim()}</span>
                                          <span className="text-xs text-default-400">
                                            {format(date, 'dd/MM/yyyy HH:mm')}
                                          </span>
                                        </div>

                                        {/* Text Content */}
                                        {formattedContent.text && (
                                          <div className="text-sm text-default-600">
                                            {formattedContent.text}
                                          </div>
                                        )}

                                        {/* Images */}
                                        {formattedContent.images.length > 0 && (
                                          <div className="grid grid-cols-1 gap-2 mt-2">
                                            {formattedContent.images.map((imageUrl, imgIndex) => (
                                              <Image
                                                key={imgIndex}
                                                src={imageUrl}
                                                alt={`Progress Image ${imgIndex + 1}`}
                                                classNames={{
                                                  img: "object-cover rounded-lg",
                                                  wrapper: "w-full max-w-md",
                                                }}
                                                radius="lg"
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </ScrollShadow>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setSelectedContractForFeedback(null);
          }}
          size="lg"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">
                    Feedback for {selectedContractForFeedback?.contractName}
                  </h2>
                </ModalHeader>
                <ModalBody>
                  {selectedContractForFeedback && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => {
                                setFeedbackRating(star);
                                const existingComments = selectedContractForFeedback.feedback?.split('\n\nComments:\n')[1] || '';
                                const newFeedback = `Rating: ${star}/5 stars\n\nComments:\n${existingComments}`;
                                setSelectedContractForFeedback(prev => ({
                                  ...prev!,
                                  feedback: newFeedback
                                }));
                              }}
                              className="text-2xl focus:outline-none"
                              type="button"
                            >
                              {star <= (feedbackRating || 0) ? (
                                <span className="text-yellow-400">★</span>
                              ) : (
                                <span className="text-gray-300">☆</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        label="Comments"
                        placeholder="Please share your experience with our service..."
                        value={selectedContractForFeedback.feedback?.split('\n\nComments:\n')[1] || ''}
                        onChange={(e) => {
                          const newFeedback = `Rating: ${feedbackRating}/5 stars\n\nComments:\n${e.target.value}`;
                          setSelectedContractForFeedback(prev => ({
                            ...prev!,
                            feedback: newFeedback
                          }));
                        }}
                        minRows={4}
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setSelectedContractForFeedback(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      if (selectedContractForFeedback) {
                        try {
                          // Lấy contract hiện tại từ danh sách
                          const currentContract = contracts.find(
                            c => c.contractId === selectedContractForFeedback.contractId
                          );

                          if (!currentContract) {
                            console.error('Contract not found');
                            return;
                          }

                          // Tạo payload với đầy đủ thông tin contract
                          const updatePayload = {
                            ...currentContract,
                            contractId: currentContract.contractId,
                            contractName: currentContract.contractName,
                            contractStartDate: currentContract.contractStartDate,
                            contractEndDate: currentContract.contractEndDate,
                            status: currentContract.status,
                            description: currentContract.description,
                            contructionProgress: currentContract.contructionProgress,
                            progressDescription: currentContract.progressDescription,
                            paymentStatus: currentContract.paymentStatus,
                            link: currentContract.link,
                            feedback: selectedContractForFeedback.feedback, // Cập nhật feedback mới
                            requests: currentContract.requests.$values.map(request => ({
                              ...request,
                              users: request.users.$values,
                              designs: request.designs?.$values || [],
                              samples: request.samples?.$values || []
                            }))
                          };

                          // Xác định loại request và gọi API tương ứng
                          const isDesignRequest = updatePayload.requests[0].designs.length > 0;
                          const updateFunction = isDesignRequest
                            ? updateContractByRequestDesignApi
                            : updateContractBySampleApi;

                          // Gọi API cập nhật
                          await updateFunction(updatePayload);

                          // Cập nhật state local
                          setContracts(prevContracts =>
                            prevContracts.map(contract =>
                              contract.contractId === currentContract.contractId
                                ? { ...contract, feedback: selectedContractForFeedback.feedback }
                                : contract
                            )
                          );

                          // Đóng modal và reset state
                          onClose();
                          setSelectedContractForFeedback(null);
                          setFeedbackRating(0);

                          // Tải lại danh sách contracts
                          await fetchContracts();
                        } catch (error) {
                          console.error('Error updating feedback:', error);
                        }
                      }
                    }}
                  >
                    Save Feedback
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
export default OrdersPage;
