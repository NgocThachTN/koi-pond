import React, { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import { getContractsApi, getUserRequestsApi, Contract, UserRequest } from '@/apis/user.api'
import { Divider } from "@nextui-org/react"

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
      case "designName":
        return item.designs.$values[0]?.designName || 'N/A'
      case "sampleName":
        return item.samples.$values[0]?.sampleName || 'N/A'
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
            View Detailsss
          </Button>
        )
      default:
        return 'N/A'
    }
  }, [onDetailsOpen])

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
                    <TableColumn key="designName">Design Name</TableColumn>
                    <TableColumn key="sampleName">Sample Name</TableColumn>
                    <TableColumn key="status">Status</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
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
    </div>
  )
}