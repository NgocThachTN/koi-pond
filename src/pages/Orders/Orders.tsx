import React from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Input } from "@nextui-org/react"
import { useNavigate } from 'react-router-dom';

type Order = {
  id: string
  projectName: string
  date: string
  status: "pending" | "processing" | "completed"
  maintenanceDate?: string
  feedback?: string
}

const statusColorMap: Record<string, "warning" | "primary" | "success"> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
}

// Updated mock data with 7 additional orders
const mockOrders: Order[] = [
  { id: "KOI-001", projectName: "Garden Koi Pond", date: "2023-03-15", status: "completed" },
  { id: "KOI-002", projectName: "Mini Koi Pond", date: "2023-03-20", status: "processing" },
  { id: "KOI-003", projectName: "Villa Koi Pond", date: "2023-03-10", status: "completed", maintenanceDate: "2023-09-10" },
  { id: "KOI-004", projectName: "Zen Garden Koi Pond", date: "2023-04-05", status: "pending" },
  { id: "KOI-005", projectName: "Restaurant Koi Feature", date: "2023-04-12", status: "completed", maintenanceDate: "2023-10-12" },
  { id: "KOI-006", projectName: "Hotel Lobby Koi Pond", date: "2023-04-18", status: "processing" },
  { id: "KOI-007", projectName: "Backyard Koi Paradise", date: "2023-04-25", status: "completed" },
  { id: "KOI-008", projectName: "Corporate Office Koi Display", date: "2023-05-02", status: "pending" },
  { id: "KOI-009", projectName: "Public Park Koi Habitat", date: "2023-05-10", status: "processing" },
  { id: "KOI-010", projectName: "Luxury Home Koi Oasis", date: "2023-05-17", status: "completed", maintenanceDate: "2023-11-17" }
]

function OrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 10
  const {isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose} = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [feedback, setFeedback] = React.useState("")
  const [maintenanceDate, setMaintenanceDate] = React.useState("")

  const pages = Math.ceil(mockOrders.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return mockOrders.slice(start, end)
  }, [page])

  const renderCell = React.useCallback((order: Order, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof Order]

    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        )
      case "details":
        return (
          <Button size="sm" color="secondary" onClick={() => {
            setSelectedOrder(order)
            setFeedback(order.feedback || "")
            onDetailsOpen()
          }}>
            View Details
          </Button>
        )
      case "maintenance":
        return order.status === "completed" ? (
          <Button 
            color="secondary" 
            onPress={() => navigate(`/maintenance`)}
          >
            Maintenance
          </Button>
        ) : null
      default:
        return cellValue
    }
  }, [onDetailsOpen, navigate])

  const handleFeedbackSubmit = () => {
    if (selectedOrder) {
      // In a real application, you would update the order in your backend here
      console.log(`Submitting feedback for order ${selectedOrder.id}: ${feedback}`)
    }
    onDetailsClose()
  }

  

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
            <Table
              aria-label="Koi Pond Construction Orders Table"
            >
              <TableHeader>
                <TableColumn key="id">Order ID</TableColumn>
                <TableColumn key="projectName">Project Name</TableColumn>
                <TableColumn key="date">Order Date</TableColumn>
                <TableColumn key="status">Status</TableColumn>
                <TableColumn key="details">Details</TableColumn>
                <TableColumn key="maintenance">Maintenance</TableColumn>
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <span className="text-small text-default-400">
                Total {mockOrders.length} orders
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
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Order Details</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Order ID:</strong> {selectedOrder?.id}</p>
                    <p><strong>Project Name:</strong> {selectedOrder?.projectName}</p>
                    <p><strong>Order Date:</strong> {selectedOrder?.date}</p>
                    <p><strong>Status:</strong> {selectedOrder?.status}</p>
                    {selectedOrder?.maintenanceDate && (
                      <p><strong>Next Maintenance Date:</strong> {selectedOrder.maintenanceDate}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                    <Textarea
                      label="Feedback"
                      placeholder="Enter your feedback here"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={selectedOrder?.status !== "completed"}
                    />
                    {selectedOrder?.status !== "completed" && (
                      <p className="text-sm text-gray-500 mt-2">Feedback can only be added for completed orders.</p>
                    )}
                  </div>
                </div>
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedOrder?.status === "completed" && (
                  <>
                    <Button color="secondary" onPress={handleFeedbackSubmit}>
                      Submit Feedback
                    </Button>
                    
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default OrdersPage