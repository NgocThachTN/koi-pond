import React from 'react'
import { NavbarUser } from '@/components/Navbar/navbaruser'
import { Card, CardBody, CardHeader, Button, Pagination } from "@nextui-org/react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import { Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"

type Order = {
  id: string
  projectName: string
  date: string
  status: "pending" | "processing" | "completed"
  maintenanceDate?: string
}

const statusColorMap: Record<string, "warning" | "primary" | "success"> = {
  pending: "warning",
  processing: "primary",
  completed: "success",
}

// Giả lập dữ liệu
const mockOrders: Order[] = [
  { id: "KOI-001", projectName: "Hồ Cá Koi Sân Vườn", date: "2023-03-15", status: "processing" },
  { id: "KOI-002", projectName: "Hồ Cá Koi Mini", date: "2023-03-20", status: "pending" },
  { id: "KOI-003", projectName: "Hồ Cá Koi Biệt Thự", date: "2023-03-10", status: "completed", maintenanceDate: "2023-09-10" },
  // Thêm nhiều đơn hàng khác ở đây...
]

function OrdersPage() {
  const [page, setPage] = React.useState(1)
  const rowsPerPage = 10
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)

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
      case "maintenance":
        return order.status === "completed" ? (
          <Button size="sm" onClick={() => {
            setSelectedOrder(order)
            onOpen()
          }}>
            Xem bảo trì
          </Button>
        ) : null
      default:
        return cellValue
    }
  }, [onOpen])

  return (
    <div>
      <NavbarUser />
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader className="flex justify-between">
            <h1 className="text-2xl font-bold">Đơn Đặt Thi Công Hồ Cá Koi</h1>
            <Button color="primary">Tạo đơn mới</Button>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Bảng đơn đặt thi công hồ cá Koi"
            >
              <TableHeader>
                <TableColumn key="id">ID Đơn hàng</TableColumn>
                <TableColumn key="projectName">Tên công trình</TableColumn>
                <TableColumn key="date">Ngày đặt</TableColumn>
                <TableColumn key="status">Trạng thái</TableColumn>
                <TableColumn key="maintenance">Bảo trì</TableColumn>
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
                Tổng {mockOrders.length} đơn hàng
              </span>
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Thông tin bảo trì</ModalHeader>
              <ModalBody>
                <p>ID Đơn hàng: {selectedOrder?.id}</p>
                <p>Tên công trình: {selectedOrder?.projectName}</p>
                <p>Ngày bảo trì tiếp theo: {selectedOrder?.maintenanceDate}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
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