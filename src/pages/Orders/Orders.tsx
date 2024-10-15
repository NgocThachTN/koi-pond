import React, { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination, Avatar, Input, Select, SelectItem, Textarea } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import { getContractsApi, getUserRequestsApi, Contract, UserRequest } from '@/apis/user.api'
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

        const [contractsResponse, requestsResponse] = await Promise.all([
          getContractsApi(),
          getUserRequestsApi(userEmail)
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
      }))
    );

    const standaloneRequests = requests.map(request => ({
      ...request,
      contractStatus: 'Pending',
      hasContract: false,
      contractName: 'N/A',
      contractId: null,
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
                  <div className="grid grid-cols-2 gap-4">
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
                      </CardBody>
                    </Card>
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
              <Card >
                <CardHeader className="flex gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
                  <Avatar icon={<FaLeaf size={24} />} className="bg-violet-800" />
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold">Request a Quote</p>
                    <p className="text-small text-white/60">Fill in the details and we'll get back to you</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-8">
                  <form className="space-y-8" >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        variant="flat"
                        isReadOnly

                        startContent={<FaLeaf className="text-violet-500" />}
                      />
                      <Input
                        label="Email"
                        type="email"
                        variant="flat"
                        isReadOnly

                        startContent={<FaEnvelope className="text-violet-500" />}
                      />
                      <Input
                        label="Phone Number"
                        variant="flat"
                        isReadOnly

                        startContent={<FaPhone className="text-violet-500" />}
                      />
                      <Input
                        label="Address"
                        variant="flat"
                        isReadOnly

                        startContent={<FaMapMarkerAlt className="text-violet-500" />}
                      />
                    </div>

                    <Select
                      label="Request Name"
                      placeholder="Choose the type of Koi pond"
                      variant="faded"
                      startContent={<FaList className="text-violet-500" />}

                    >
                      <SelectItem key="Landscape Design and Construction" value="Landscape Design and Construction">Landscape Design and Construction</SelectItem>
                      <SelectItem key="Garden Design and Construction" value="Garden Design and Construction">Garden Design and Construction</SelectItem>
                      <SelectItem key="Patio Design and Construction" value="Patio Design and Construction">Patio Design and Construction</SelectItem>
                      <SelectItem key="Koi Pond Design and Construction" value="Koi Pond Design and Construction">Koi Pond Design and Construction</SelectItem>
                      <SelectItem key="Vertical Garden Design and Construction" value="Vertical Garden Design and Construction">Vertical Garden Design and Construction</SelectItem>
                      <SelectItem key="Other Services" value="other">Other Services</SelectItem>
                    </Select>


                    <Select
                      label="Type"
                      placeholder="Choose the service you're interested in"
                      variant="faded"
                      startContent={<FaList className="text-violet-500" />}

                    >
                      <SelectItem key="sample" value="sample">Sample Projects</SelectItem>
                      <SelectItem key="design" value="design">Custom Design</SelectItem>
                    </Select>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Sample Name"
                        placeholder="Choose the project type"
                        variant="faded"
                        startContent={<FaList className="text-violet-500" />}

                      >
                        <SelectItem key="Traditional Koi Pond" value="Traditional Koi Pond">Traditional Koi Pond</SelectItem>
                        <SelectItem key="Modern Koi Pond" value="Modern Koi Pond">Modern Koi Pond</SelectItem>
                        <SelectItem key="Natural Koi Pond" value="Natural Koi Pond">Natural Koi Pond</SelectItem>
                        <SelectItem key="Indoor Koi Pond" value="Indoor Koi Pond">Indoor Koi Pond</SelectItem>
                      </Select>

                      <Select
                        label="Sample Size"
                        placeholder="Choose the project size"
                        variant="faded"
                        startContent={<FaRuler className="text-violet-500" />}

                      >
                        <SelectItem key="Small (up to 500 gallons)" value="Small (up to 500 gallons)">Small (up to 500 gallons)</SelectItem>
                        <SelectItem key="Medium (500-1500 gallons)" value="Medium (500-1500 gallons)">Medium (500-1500 gallons)</SelectItem>
                        <SelectItem key="Large (1500-5000 gallons)" value="Large (1500-5000 gallons)">Large (1500-5000 gallons)</SelectItem>
                        <SelectItem key="Extra Large (5000+ gallons)" value="Extra Large (5000+ gallons)">Extra Large (5000+ gallons)</SelectItem>
                      </Select>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Design Name"
                        placeholder="Choose the design type"
                        variant="faded"
                        startContent={<FaList className="text-violet-500" />}

                      >
                        <SelectItem key="Traditional Koi Pond" value="Traditional Koi Pond">Traditional Koi Pond</SelectItem>
                        <SelectItem key="Modern Koi Pond" value="Modern Koi Pond">Modern Koi Pond</SelectItem>
                        <SelectItem key="Natural Koi Pond" value="Natural Koi Pond">Natural Koi Pond</SelectItem>
                        <SelectItem key="Zen-style Koi Pond" value="Zen-style Koi Pond">Zen-style Koi Pond</SelectItem>
                        <SelectItem key="Raised Koi Pond" value="Raised Koi Pond">Raised Koi Pond</SelectItem>
                      </Select>

                      <Select
                        label="Design Size"
                        placeholder="Choose the design size"
                        variant="faded"
                        startContent={<FaRuler className="text-violet-500" />}

                      >
                        <SelectItem key="Small (up to 500 gallons)" value="Small (up to 500 gallons)">Small (up to 500 gallons)</SelectItem>
                        <SelectItem key="Medium (500-1500 gallons)" value="Medium (500-1500 gallons)">Medium (500-1500 gallons)</SelectItem>
                        <SelectItem key="Large (1500-5000 gallons)" value="Large (1500-5000 gallons)">Large (1500-5000 gallons)</SelectItem>
                        <SelectItem key="Extra Large (5000+ gallons)" value="Extra Large (5000+ gallons)">Extra Large (5000+ gallons)</SelectItem>
                      </Select>
                    </div>

                    <Textarea
                      label="Request Details"
                      placeholder="Describe your requirements in detail"
                      variant="faded"
                      minRows={3}
                      startContent={<FaComments className="text-violet-500 mt-2" />}

                    />
                    <Button
                      type="submit"
                      color="secondary"
                      className="w-full text-lg font-semibold py-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Submit Quote Request
                    </Button>
                  </form>
                  <p className="text-sm text-violet-400 mt-6 text-center">*We typically respond within 24 business hours</p>
                </CardBody>
              </Card>

              <Modal


                backdrop="blur"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">Request Submitted Successfully</ModalHeader>
                      <ModalBody>
                        <div className="flex items-center gap-4">
                          <FaCheckCircle className="text-green-500 text-4xl" />
                          <p>Your quote request has been submitted successfully!</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">We'll get back to you within 24 business hours.</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onPress={onClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
export default OrdersPage;