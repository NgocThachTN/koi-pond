import React, { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import { getUserRequestsApi, UserRequest } from '@/apis/user.api'
import { Divider } from "@nextui-org/react"
import { getContractsApi, Contract } from '@/apis/user.api'

const statusColorMap: Record<string, "warning" | "primary" | "success"> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
}

function OrdersPage() {
  const [orders, setOrders] = useState<UserRequest[]>([])
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const rowsPerPage = 10
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<UserRequest | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const data = await getUserRequestsApi(userEmail)
          // Lọc các đơn hàng chỉ của người dùng hiện tại
          const userOrders = data.filter(order =>
            order.users?.$values?.[0]?.email === userEmail
          )
          setOrders(userOrders)
        } else {
          setError('User email not found. Please log in again.')
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError('Failed to fetch orders. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const pages = Math.ceil(orders.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return orders.slice(start, end)
  }, [page, orders])

  const fetchContractForOrder = async (orderId: string) => {
    try {
      const response = await getContractsApi()
      const contracts = response.data.$values
      const relatedContract = contracts.find(contract => 
        contract.requests.$values.some(request => request.$id === orderId)
      )
      setSelectedContract(relatedContract || null)
    } catch (error) {
      console.error('Failed to fetch contract:', error)
      setSelectedContract(null)
    }
  }

  const renderCell = React.useCallback((order: UserRequest, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return order.$id
      case "requestName":
        return order.requestName
      case "userName":
        return order.users.$values[0]?.userName || 'N/A'
      case "designName":
        return order.designs.$values[0]?.designName || 'No Selected'
      case "sampleName":
        return order.samples.$values[0]?.sampleName || 'No Selected'
      case "description":
        return order.description
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={async () => {
            setSelectedOrder(order)
            await fetchContractForOrder(order.$id)
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      default:
        return 'N/A'
    }
  }, [onDetailsOpen, fetchContractForOrder])

  return (
    <div className="min-h-screen bg-background">
      <NavbarUser />
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">Koi Pond Construction Orders</h1>
            <Button color="secondary">Create New Order</Button>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <>
                <Table aria-label="Koi Pond Construction Orders Table">
                  <TableHeader>
                    <TableColumn key="id">Order ID</TableColumn>
                    <TableColumn key="requestName">Project Name</TableColumn>
                    <TableColumn key="userName">Customer Name</TableColumn>
                    <TableColumn key="designName">Design Name</TableColumn>
                    <TableColumn key="sampleName">Sample Name</TableColumn>
                    <TableColumn key="description">Description</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.$id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )) || <TableRow><TableCell>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-small text-default-400">
                    Total {orders.length} orders
                  </span>
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
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
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Order Details</h2>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Customer Informationnn</h3>
                        <p><strong>Name:</strong> {selectedOrder.users.$values[0]?.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedOrder.users.$values[0]?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedOrder.users.$values[0]?.phoneNumber || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedOrder.users.$values[0]?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
                        <p><strong>Project Name:</strong> {selectedOrder.requestName}</p>
                        <p><strong>Description:</strong> {selectedOrder.description}</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Design Details</h3>
                        {selectedOrder.designs.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.designs.$values[0].designName}</p>
                            <p><strong>Size:</strong> {selectedOrder.designs.$values[0].designSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.designs.$values[0].designPrice}</p>
                          </>
                        ) : (
                          <p>No design selected</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sample Details</h3>
                        {selectedOrder.samples.$values[0] ? (
                          <>
                            <p><strong>Name:</strong> {selectedOrder.samples.$values[0].sampleName}</p>
                            <p><strong>Size:</strong> {selectedOrder.samples.$values[0].sampleSize}</p>
                            <p><strong>Price:</strong> ${selectedOrder.samples.$values[0].samplePrice}</p>
                          </>
                        ) : (
                          <p>No sample selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selectedContract && (
                  <>
                    <Divider />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
                      <p><strong>Contract Name:</strong> {selectedContract.contractName}</p>
                      <p><strong>Start Date:</strong> {new Date(selectedContract.contractStartDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(selectedContract.contractEndDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {selectedContract.status}</p>
                      <p><strong>Description:</strong> {selectedContract.description}</p>
                    </div>
                  </>
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

export default OrdersPage