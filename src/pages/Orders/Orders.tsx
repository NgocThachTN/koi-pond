import React, { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination, Avatar, Input, Select, SelectItem, Textarea } from "@nextui-org/react"
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
  MaintenanceRequest
} from '@/apis/user.api'
import { Divider } from "@nextui-org/react"
import { FaCheckCircle, FaComments, FaEnve, FaMapMarkerAltlope, FaLeaf, FaPhone, FaList, FaRuler, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

const statusColorMap: Record<string, "warning" | "primary" | "success"> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
}

function OrdersPage() {
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const userEmail = localStorage.getItem('userEmail')
        if (!userEmail) {
          setError('User email not found. Please log in again.')
          return
        }

        const [contractsResponse, requestsResponse, maintenanceResponse] = await Promise.all([
          getContractsApi(),
          getUserRequestsApi(userEmail),
          getMaintenanceRequestsApi()
        ])

        if (contractsResponse.data && contractsResponse.data.$values) {
          const userContracts = contractsResponse.data.$values.filter((contract: Contract) =>
            contract.requests.$values.some(request =>
              request.users.$values.some(user => user.email === userEmail)
            )
          )
          setContracts(userContracts)
        }

        if (requestsResponse) {
          const userRequests = requestsResponse.filter((request: UserRequest) =>
            request.users.$values.some(user => user.email === userEmail)
          )
          setRequests(userRequests)
        }

        if (maintenanceResponse.data && maintenanceResponse.data.$values) {
          setMaintenanceRequests(maintenanceResponse.data.$values)
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
    const contractItems = contracts.flatMap(contract =>
      contract.requests.$values.map(request => ({
        ...request,
        contractStatus: contract.status,
        hasContract: true,
        contractName: contract.contractName,
        contractId: contract.contractId,
        contractStartDate: contract.contractStartDate,
        contractEndDate: contract.contractEndDate,
        contractDescription: contract.description, // Add this line
      }))
    );

    const standaloneRequests = requests.map(request => ({
      ...request,
      contractStatus: 'Pending',
      hasContract: false,
      contractName: 'N/A',
      contractId: null,
      contractStartDate: null,
      contractEndDate: null,
    }));

    return [...contractItems, ...standaloneRequests];
  }, [contracts, requests])

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
        if (item.designs.$values[0]?.designName) {
          return 'Design'
        } else if (item.samples.$values[0]?.sampleName) {
          return 'Sample'
        } else {
          return 'N/A'
        }
      case "status":
        return item.hasContract ? item.contractStatus : 'Pending'
      case "description":
        return item.description || 'N/A'
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
      default:
        return 'N/A'
    }
  }, [onDetailsOpen, onMaintenanceOpen])

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
      status: "Pending"
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

  return (
    <div className="min-h-screen bg-background">
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
      </div>

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
                <h2 className="text-2xl font-bold">Request Details</h2>
              </ModalHeader>
              <ModalBody>
                {selectedItem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold">Request Information</h3>
                      </CardHeader>
                      <CardBody>
                        <p><strong>Name:</strong> {selectedItem.requestName}</p>
                        <p><strong>Status:</strong> {selectedItem.contractStatus}</p>
                        <p><strong>Description:</strong> {selectedItem.description}</p>
                        {selectedItem.hasContract && (
                          <>
                            <p><strong>Contract Name:</strong> {selectedItem.contractName}</p>
                            <p><strong>Start Date:</strong> {selectedItem.contractStartDate}</p>
                            <p><strong>End Date:</strong> {selectedItem.contractEndDate}</p>
                            <p><strong>Construction progress:</strong> {selectedItem.contractDescription}</p>
                          </>
                        )}
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold">Details</h3>
                      </CardHeader>
                      <CardBody className="overflow-y-auto max-h-[60vh]">
                        <h5 className="text-md font-semibold mt-2">User:</h5>
                        {selectedItem.users.$values.map((user, userIndex) => (
                          <div key={userIndex} className="ml-2">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phoneNumber}</p>
                            <p><strong>Address:</strong> {user.address}</p>
                          </div>
                        ))}
                        {selectedItem.designs.$values.length > 0 && (
                          <>
                            <Divider className="my-2" />
                            <h5 className="text-md font-semibold mt-2">Design:</h5>
                            {selectedItem.designs.$values.map((design, designIndex) => (
                              <div key={designIndex} className="ml-2">
                                <p><strong>Name:</strong> {design.designName}</p>
                                <p><strong>Size:</strong> {design.designSize}</p>
                                <p><strong>Price:</strong> ${design.designPrice}</p>
                              </div>
                            ))}
                          </>
                        )}
                        {selectedItem.samples.$values.length > 0 && (
                          <>
                            <Divider className="my-2" />
                            <h5 className="text-md font-semibold mt-2">Sample:</h5>
                            {selectedItem.samples.$values.map((sample, sampleIndex) => (
                              <div key={sampleIndex} className="ml-2">
                                <p><strong>Name:</strong> {sample.sampleName}</p>
                                <p><strong>Size:</strong> {sample.sampleSize}</p>
                                <p><strong>Price:</strong> ${sample.samplePrice}</p>
                              </div>
                            ))}
                          </>
                        )}
                      </CardBody>
                    </Card>
                    {selectedItem.contractStatus === 'Completed' && (
                      <Card>
                        <CardHeader>
                          <h3 className="text-xl font-semibold">Maintenance Information</h3>
                        </CardHeader>
                        <CardBody>
                          {maintenanceRequests.some(mr =>
                            mr.requests.$values.some(r =>
                              r.requestId === selectedItem.requestId &&
                              r.users.$values.some(u => u.email === localStorage.getItem('userEmail'))
                            )
                          ) ? (
                            maintenanceRequests
                              .filter(mr => mr.requests.$values.some(r =>
                                r.requestId === selectedItem.requestId &&
                                r.users.$values.some(u => u.email === localStorage.getItem('userEmail'))
                              ))
                              .map((mr, index) => (
                                <div key={index} className="mb-4">
                                  <p><strong>Maintenance ID:</strong> {mr.maintenanceRequestId}</p>
                                  <p><strong>Start Date:</strong> {new Date(mr.maintenanceRequestStartDate).toLocaleDateString()}</p>
                                  <p><strong>End Date:</strong> {new Date(mr.maintenanceRequestEndDate).toLocaleDateString()}</p>
                                  <p><strong>Status:</strong> {mr.status}</p>
                                  <p><strong>Services:</strong></p>
                                  <ul className="list-disc pl-5">
                                    {mr.maintenance.$values.map((m, idx) => (
                                      <li key={idx}>{m.maintencaceName}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                          ) : (
                            <p>No maintenance requests found for this item.</p>
                          )}
                        </CardBody>
                      </Card>
                    )}
                  </div>
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
    </div>
  )
}
export default OrdersPage;
