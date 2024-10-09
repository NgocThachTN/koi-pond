import React, { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Input } from "@nextui-org/react"
import { getUserRequestsApi, UserRequest } from '@/apis/user.api'

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
  const {isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose} = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<UserRequest | null>(null)

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

  const renderCell = React.useCallback((order: UserRequest, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return order.$id
      case "requestName":
        return order.requestName
      case "userName":
        return order.users.$values[0]?.userName || 'N/A'
      case "designName":
        return order.designs.$values[0]?.designName || 'N/A'
      case "sampleName":
        return order.samples.$values[0]?.sampleName || 'N/A'
      case "description":
        return order.description
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedOrder(order)
            onDetailsOpen()
          }}>
            View Details
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
                    <TableColumn key="userName">User Name</TableColumn>
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

      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Order Details</ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div>
                    <p><strong>Order ID:</strong> {selectedOrder.$id}</p>
                    <p><strong>Project Name:</strong> {selectedOrder.requestName}</p>
                    <p><strong>User Name:</strong> {selectedOrder.users.$values[0]?.userName || 'N/A'}</p>
                    <p><strong>User Email:</strong> {selectedOrder.users.$values[0]?.email || 'N/A'}</p>
                    <p><strong>User Phone:</strong> {selectedOrder.users.$values[0]?.phoneNumber || 'N/A'}</p>
                    <p><strong>User Address:</strong> {selectedOrder.users.$values[0]?.address || 'N/A'}</p>
                    {selectedOrder.designs.$values[0] && (
                      <>
                        <p><strong>Design Name:</strong> {selectedOrder.designs.$values[0].designName}</p>
                        <p><strong>Design Size:</strong> {selectedOrder.designs.$values[0].designSize}</p>
                        <p><strong>Design Price:</strong> {selectedOrder.designs.$values[0].designPrice}</p>
                      </>
                    )}
                    {selectedOrder.samples.$values[0] && (
                      <>
                        <p><strong>Sample Name:</strong> {selectedOrder.samples.$values[0].sampleName}</p>
                        <p><strong>Sample Size:</strong> {selectedOrder.samples.$values[0].sampleSize}</p>
                        <p><strong>Sample Price:</strong> {selectedOrder.samples.$values[0].samplePrice}</p>
                      </>
                    )}
                    <p><strong>Description:</strong> {selectedOrder.description}</p>
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

export default OrdersPage