import React, { useEffect, useState, useMemo } from 'react';
import DefaultStaffLayout from '@/layouts/defaultstaff';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination, Input, Card, CardBody, CardHeader, Divider, Image, Tabs, Tab, User, Link } from "@nextui-org/react";
import { SearchIcon, EyeIcon } from '@nextui-org/shared-icons';
import { getUserRequestsApi, UserRequest, createContractByRequestDesignApi, createContractBySampleDesignApi } from '@/apis/user.api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import emailjs from '@emailjs/browser';

const DesignAndSample: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<UserRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractId, setContractId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false);
  const [contractData, setContractData] = useState({
    contractName: '',
    contractStartDate: '',
    contractEndDate: '',
    description: '',
    feedback: '',
    link: ''
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserRequestsApi('');
        // Sắp xếp requests theo requestID giảm dần
        const sortedData = data.sort((a, b) => parseInt(b.$id) - parseInt(a.$id));
        setRequests(sortedData);
        setFilteredRequests(sortedData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = requests.filter(request =>
      request.users.$values.some(user =>
        user.name.toLowerCase().includes(lowercasedFilter)
      )
    );
    // Không cần sắp xếp lại ở đây vì requests đã được sắp xếp
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, requests]);

  const columns = [
    { name: "CUSTOMER", uid: "user" },
    { name: "REQUEST NAME", uid: "requestName" },
    { name: "DESCRIPTION", uid: "description" },
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleCreateContractClick = (request: UserRequest) => {
    setSelectedRequest(request);
    setContractData({
      contractName: `Contract for ${request.requestName}`,
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: request.description,
      feedback: '',
      link: ''
    });
    setIsCreateContractModalOpen(true);
  };

  const generatePDF = (contractData: any, selectedRequest: UserRequest) => {
    const doc = new jsPDF();

    // Helper functions
    const addText = (text: string, x: number, y: number, options?: any) => {
      doc.text(text, x, y, options);
      return doc.getTextDimensions(text).h + 2;
    };

    const addSection = (title: string, content: string[], startY: number) => {
      let y = startY;
      doc.setFontSize(12);
      doc.setFont('Roboto', 'bold');
      y += addText(title, 20, y);
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      content.forEach(item => {
        const lines = doc.splitTextToSize(item, 170);
        lines.forEach(line => {
          y += addText(line, 25, y);
        });
      });
      return y + 5;
    };

    // Cover Page
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");

    doc.setFontSize(36);
    addText('KOI POND MASTERS', 105, 80, { align: 'center' });

    doc.setFontSize(24);
    addText('KOI POND', 105, 110, { align: 'center' });
    addText('CONSTRUCTION CONTRACT', 105, 120, { align: 'center' });

    doc.setFontSize(14);
    addText(`Date: ${format(new Date(), 'MMMM d, yyyy')}`, 105, 150, { align: 'center' });
    addText(`Contract ID: ${contractData.contractName}`, 105, 165, { align: 'center' });

    const size = selectedRequest.designs.$values.length > 0
      ? selectedRequest.designs.$values[0].designSize
      : selectedRequest.samples.$values[0].sampleSize;
    const type = selectedRequest.designs.$values.length > 0 ? 'Design' : 'Sample';
    addText(`${type} Size: ${size}`, 105, 180, { align: 'center' });

    doc.setFontSize(12);
    addText('CONFIDENTIAL', 105, 280, { align: 'center' });

    // Contract Details
    doc.addPage();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    yPosition += addText('KOI POND CONSTRUCTION AGREEMENT', 105, yPosition, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    yPosition = addSection('1. PARTIES', [
      `This agreement is made on ${format(new Date(contractData.contractStartDate), 'MMMM d, yyyy')} between:`,
      'Contractor: KOI POND CONTRUCTIONS',
      'Address: Koi Pond Contructions Coop, Ho Chi Minh City, VietNam',
      `Customer Name: ${selectedRequest.users.$values[0].name}`,
      `Address: ${selectedRequest.users.$values[0].address}`,
      `Phone: ${selectedRequest.users.$values[0].phoneNumber}` // Thêm số điện thoại của khách hàng

    ], yPosition + 10);

    yPosition = addSection('2. PROJECT DETAILS', [
      `Project: ${selectedRequest.requestName}`,
      `${type} Size: ${size}`,
      `Start Date: ${format(new Date(contractData.contractStartDate), 'MMMM d, yyyy')}`,
      `Completion Date: ${format(new Date(contractData.contractEndDate), 'MMMM d, yyyy')}`,
      `Description: ${contractData.description}`
    ], yPosition);

    yPosition = addSection('3. SCOPE OF WORK', [
      `3.1. The Contractor agrees to construct a koi pond as per the project "${selectedRequest.requestName}" based on the approved ${type.toLowerCase()}.`,
      '3.2. The work shall include:',
      '   a) Site preparation and excavation',
      '   b) Installation of pond liner and underlayment',
      '   c) Construction of pond walls and bottom',
      '   d) Installation of filtration and pumping systems',
      '   e) Installation of plumbing and electrical systems',
      '   f) Addition of rocks, gravel, and decorative elements',
      '   g) Planting of aquatic vegetation',
      '   h) Water quality testing and balancing'
    ], yPosition);

    // New page for materials and pricing
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    yPosition += addText('4. MATERIALS AND PRICING', 20, yPosition);

    const koiPondMaterials = [
      { item: "EPDM Pond Liner", unit: "sq ft", unitPrice: 0.95, quantity: 500, total: 475 },
      { item: "Underlayment", unit: "sq ft", unitPrice: 0.30, quantity: 500, total: 150 },
      { item: "Filtration System", unit: "unit", unitPrice: 1200, quantity: 1, total: 1200 },
      { item: "Pump", unit: "unit", unitPrice: 500, quantity: 1, total: 500 },
      { item: "UV Clarifier", unit: "unit", unitPrice: 300, quantity: 1, total: 300 },
      { item: "Skimmer", unit: "unit", unitPrice: 250, quantity: 1, total: 250 },
      { item: "Plumbing Materials", unit: "set", unitPrice: 400, quantity: 1, total: 400 },
      { item: "Rocks and Gravel", unit: "ton", unitPrice: 100, quantity: 3, total: 300 },
      { item: "Aquatic Plants", unit: "set", unitPrice: 200, quantity: 1, total: 200 },
      { item: "Electrical Components", unit: "set", unitPrice: 300, quantity: 1, total: 300 },
    ];

    (doc as any).autoTable({
      startY: yPosition,
      head: [['Item', 'Unit', 'Unit Price ($)', 'Quantity', 'Total ($)']],
      body: koiPondMaterials.map(item => [
        item.item,
        item.unit,
        item.unitPrice.toFixed(2),
        item.quantity,
        item.total.toFixed(2)
      ]),
      foot: [['', '', '', 'Subtotal:', koiPondMaterials.reduce((sum, item) => sum + item.total, 0).toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const laborCost = 5000;
    const subtotal = koiPondMaterials.reduce((sum, item) => sum + item.total, 0) + laborCost;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    yPosition = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPosition += addText(`Labor Cost: $${laborCost.toFixed(2)}`, 140, yPosition);
    yPosition += addText(`Subtotal: $${subtotal.toFixed(2)}`, 140, yPosition);
    yPosition += addText(`Tax (8%): $${tax.toFixed(2)}`, 140, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    yPosition += addText(`Total: $${total.toFixed(2)}`, 140, yPosition);

    yPosition = addSection('5. PAYMENT TERMS', [
      '5.1. The total contract price is payable as follows:',
      '   a) 50% due upon contract signing',
      '   b) 25% due at project midpoint',
      '   c) 25% due upon project completion',
      '5.2. Payments are due within 7 days of invoicing.',
      '5.3. Late payments will incur a 1.5% monthly interest charge.'
    ], yPosition + 10);

    // Additional Terms
    doc.addPage();
    yPosition = 20;

    yPosition = addSection('6. ADDITIONAL TERMS AND CONDITIONS', [
      '6.1. Permits and Regulations: The Contractor shall obtain all necessary permits and comply with local regulations.',
      '6.2. Site Access: The Client shall provide clear access to the work site.',
      '6.3. Utilities: The Client shall provide access to water and electricity as needed for the project.',
      '6.4. Changes: Any changes to the agreed design must be approved in writing and may affect cost and timeline.',
      '6.5. Warranty: The Contractor provides a 2-year warranty on pond structure and 1-year on equipment.',
      '6.6. Maintenance: The Contractor will provide basic training on koi pond maintenance upon completion.',
      '6.7. Landscaping: Unless specified, surrounding landscaping is not included in this contract.',
      '6.8. Delays: The Contractor will promptly communicate any expected delays.',
      '6.9. Termination: Either party may terminate with 30 days written notice. The Client shall pay for work completed.',
      '6.10. Liability: The Contractor shall maintain appropriate insurance coverage for the project.',
      '6.11. Dispute Resolution: Any disputes shall be resolved through mediation before legal action.',
      '6.12. Entire Agreement: This contract constitutes the entire agreement between the parties.'
    ], yPosition);

    // Signatures
    yPosition = addSection('7. SIGNATURES', [
      'By signing below, both parties agree to the terms and conditions set forth in this contract.'
    ], yPosition + 20);

    doc.line(20, yPosition, 90, yPosition);
    yPosition += addText('Contractor Signature', 55, yPosition + 5, { align: 'center' });
    yPosition += 20;

    doc.line(120, yPosition - 25, 190, yPosition - 25);
    addText('Client Signature', 155, yPosition - 20, { align: 'center' });

    return doc;
  };

  const handleCreateContract = async () => {
    if (!selectedRequest) return;

    try {
      // Generate PDF first
      const pdfDoc = generatePDF(contractData, selectedRequest);
      const pdfBlob = pdfDoc.output('blob');

      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `contracts/${contractData.contractName}.pdf`);
      await uploadBytes(storageRef, pdfBlob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update contractData with the PDF link
      const updatedContractData = {
        contractName: contractData.contractName,
        contractStartDate: contractData.contractStartDate,
        contractEndDate: contractData.contractEndDate,
        description: contractData.description,
        feedback: contractData.feedback,
        link: downloadURL,
        status: "Pending"
      };

      // Prepare contract data for API
      const contractDataToSend = {
        requests: [{
          users: selectedRequest.users.$values,
          designs: selectedRequest.designs.$values,
          samples: selectedRequest.samples.$values,
          requestName: selectedRequest.requestName,
          description: selectedRequest.description,
        }],
        ...updatedContractData
      };

      // Create contract via API
      let response;
      if (selectedRequest.designs.$values.length > 0) {
        response = await createContractByRequestDesignApi(contractDataToSend);
      } else if (selectedRequest.samples.$values.length > 0) {
        response = await createContractBySampleDesignApi(contractDataToSend);
      } else {
        throw new Error("Neither design nor sample found in the request");
      }

      if (response.status === 201) {
        setContractId(response.data.$id);

        // Send email to customer
        const customerEmail = selectedRequest.users.$values[0].email;
        const customerName = selectedRequest.users.$values[0].name;

        const emailParams = {
          to_email: customerEmail,
          to_name: customerName,
          from_name: "Koi Pond Masters",
          contract_name: contractData.contractName,
          contract_link: downloadURL,
        };

        await emailjs.send(
          'service_bwbc9k9',
          'template_imxotql',
          emailParams,
          '4w9Ngb751DSTr2_wp'
        );

        console.log('Email sent successfully');

        // Update local state with the new contract data including the link
        setContractData(updatedContractData);

        // Close the create contract modal
        setIsCreateContractModalOpen(false);

        // Open the success modal
        setIsModalOpen(true);

        // Open the PDF in a new tab
        window.open(downloadURL, '_blank');
      } else {
        alert(`Failed to create contract: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert(`Failed to create contract: ${error.message || 'Unknown error'}`);
    }
  };

  const handleViewDetails = (request: UserRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const renderCell = (request: UserRequest, columnKey: React.Key) => {
    const user = request.users.$values[0] || {};
    const design = request.designs.$values[0];
    const sample = request.samples.$values[0];

    switch (columnKey) {
      case "user":
        return (
          <div>
            <div className="font-semibold">{user.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
          </div>
        );
      case "requestName":
        return request.requestName || 'N/A';
      case "description":
        return (
          <Tooltip content={request.description || 'No description'}>
            <span className="truncate max-w-xs">
              {(request.description || 'N/A').split('\n')[0]}
            </span>
          </Tooltip>
        );
      case "type":
        if (design) {
          return (
            <Chip color="primary" variant="flat">
              Design
            </Chip>
          );
        } else if (sample) {
          return (
            <Chip color="secondary" variant="flat">
              Sample
            </Chip>
          );
        } else {
          return "N/A";
        }
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light" onPress={() => handleViewDetails(request)}>
                <EyeIcon className="text-default-400" />
              </Button>
            </Tooltip>
            <Button color="primary" size="sm" onClick={() => handleCreateContractClick(request)}>
              Accept Request
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRequests.slice(start, end);
  }, [currentPage, filteredRequests]);

  return (
    <DefaultStaffLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Design & Sample Management</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by customer name..."
            startContent={<SearchIcon />}
            value={searchTerm}
            onClear={() => setSearchTerm("")}
            onValueChange={setSearchTerm}
          />
        </div>
        <Table aria-label="User Requests Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginatedRequests}>
            {(item) => (
              <TableRow key={item.$id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(filteredRequests.length / itemsPerPage)}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Contract Created Successfully</ModalHeader>
            <ModalBody>
              <p>Your contract has been created successfully.</p>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          size="4xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">Request Details</h2>
                </ModalHeader>
                <ModalBody>
                  {selectedRequest && (
                    <Tabs aria-label="Request Details">
                      <Tab key="overview" title="Overview">
                        <Card>
                          <CardBody>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-small text-default-500">Request Name</p>
                                <p className="text-medium font-semibold">{selectedRequest.requestName}</p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Type</p>
                                <p className="text-medium font-semibold">
                                  {selectedRequest.designs.$values.length > 0 ? 'Design' : 'Sample'}
                                </p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Size</p>
                                <p className="text-medium font-semibold">
                                  {selectedRequest.designs.$values.length > 0
                                    ? selectedRequest.designs.$values[0].designSize
                                    : selectedRequest.samples.$values[0].sampleSize}
                                </p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Price</p>
                                <p className="text-medium font-semibold">
                                  ${selectedRequest.designs.$values.length > 0
                                    ? selectedRequest.designs.$values[0].designPrice
                                    : selectedRequest.samples.$values[0].samplePrice}
                                </p>
                              </div>
                            </div>
                            <Divider className="my-4" />
                            <p className="text-small text-default-500">Description</p>
                            <p className="text-medium">{selectedRequest.description}</p>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab key="users" title="Users">
                        <Card>
                          <CardBody>
                            {selectedRequest.users.$values.map((user, index) => (
                              <div key={index} className="mb-8 last:mb-0">
                                <User
                                  name={user.name}
                                  description={user.email}

                                  classNames={{
                                    name: "text-xl",
                                    description: "text-lg",
                                  }}
                                />
                                <div className="mt-4 grid grid-cols-2 gap-4 text-large">
                                  <div>
                                    <p className="text-default-500 text-lg">User ID</p>
                                    <p className="font-semibold text-xl">{user.$id}</p>
                                  </div>
                                  <div>
                                    <p className="text-default-500 text-lg">Username</p>
                                    <p className="font-semibold text-xl">{user.userName}</p>
                                  </div>
                                  <div>
                                    <p className="text-default-500 text-lg">Phone</p>
                                    <p className="font-semibold text-xl">{user.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-default-500 text-lg">Role</p>
                                    <p className="font-semibold text-xl">{user.roleId}</p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <p className="text-default-500 text-lg">Address</p>
                                  <p className="font-semibold text-xl">{user.address}</p>
                                </div>
                                {index < selectedRequest.users.$values.length - 1 && <Divider className="my-4" />}
                              </div>
                            ))}
                          </CardBody>
                        </Card>
                      </Tab>
                      {selectedRequest.designs.$values.length > 0 && (
                        <Tab key="designs" title="Designs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedRequest.designs.$values.map((design, index) => (
                              <Card key={index} className="max-w-[340px]">
                                <CardHeader>
                                  <h4 className="text-medium font-semibold">{design.designName}</h4>
                                </CardHeader>
                                <CardBody>
                                  <p><strong>Construction Type:</strong> {design.constructionTypeName}</p>
                                  <p><strong>Size:</strong> {design.designSize}</p>
                                  <p><strong>Price:</strong> ${design.designPrice}</p>
                                  <Image
                                    alt="Design image"
                                    src={design.designImage}
                                    width={300}
                                    height={200}
                                  />
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        </Tab>
                      )}
                      {selectedRequest.samples.$values.length > 0 && (
                        <Tab key="samples" title="Samples">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedRequest.samples.$values.map((sample, index) => (
                              <Card key={index} className="max-w-[340px]">
                                <CardHeader>
                                  <h4 className="text-medium font-semibold">{sample.sampleName}</h4>
                                </CardHeader>
                                <CardBody>
                                  <p><strong>Construction Type:</strong> {sample.constructionTypeName}</p>
                                  <p><strong>Size:</strong> {sample.sampleSize}</p>
                                  <p><strong>Price:</strong> ${sample.samplePrice}</p>
                                  <Image
                                    alt="Sample image"
                                    src={sample.sampleImage}
                                    width={300}
                                    height={200}
                                  />
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        </Tab>
                      )}
                    </Tabs>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isCreateContractModalOpen}
          onClose={() => setIsCreateContractModalOpen(false)}
          size="5xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Create Contract</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left side: Request Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Request Information</h3>
                      {selectedRequest && (
                        <>
                          <p><strong>Request Name:</strong> {selectedRequest.requestName}</p>
                          <p><strong>Description:</strong> {selectedRequest.description}</p>
                          <p><strong>Type:</strong> {selectedRequest.designs.$values.length > 0 ? 'Design' : 'Sample'}</p>

                          <Divider className="my-4" />

                          {selectedRequest.designs.$values.length > 0 ? (
                            <>
                              <h4 className="text-md font-semibold mt-2 mb-1">Design Details</h4>
                              {selectedRequest.designs.$values.map((design, index) => (
                                <div key={index}>
                                  <p><strong>Design Name:</strong> {design.designName}</p>
                                  <p><strong>Construction Type:</strong> {design.constructionTypeName}</p>
                                  <p><strong>Size:</strong> {design.designSize}</p>
                                  <p><strong>Price:</strong> ${design.designPrice}</p>
                                  <Image
                                    alt="Design image"
                                    src={design.designImage}
                                    width={150}
                                    height={100}
                                  />
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              <h4 className="text-md font-semibold mt-2 mb-1">Sample Details</h4>
                              {selectedRequest.samples.$values.map((sample, index) => (
                                <div key={index}>
                                  <p><strong>Sample Name:</strong> {sample.sampleName}</p>
                                  <p><strong>Construction Type:</strong> {sample.constructionTypeName}</p>
                                  <p><strong>Size:</strong> {sample.sampleSize}</p>
                                  <p><strong>Price:</strong> ${sample.samplePrice}</p>
                                  <Image
                                    alt="Sample image"
                                    src={sample.sampleImage}
                                    width={150}
                                    height={100}
                                  />
                                </div>
                              ))}
                            </>
                          )}

                          <Divider className="my-4" />
                          <h4 className="text-md font-semibold mb-1">Customer Information</h4>
                          {selectedRequest.users.$values[0] && (
                            <>
                              <p><strong>Name:</strong> {selectedRequest.users.$values[0].name}</p>
                              <p><strong>Email:</strong> {selectedRequest.users.$values[0].email}</p>
                              <p><strong>Phone:</strong> {selectedRequest.users.$values[0].phoneNumber}</p>
                              <p><strong>Address:</strong> {selectedRequest.users.$values[0].address}</p>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* Right side: Contract Information Form */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
                      <Input
                        label="Contract Name"
                        value={contractData.contractName}
                        onChange={(e) => setContractData({ ...contractData, contractName: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={contractData.contractStartDate}
                        onChange={(e) => setContractData({ ...contractData, contractStartDate: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={contractData.contractEndDate}
                        onChange={(e) => setContractData({ ...contractData, contractEndDate: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        label="Description"
                        value={contractData.description}
                        onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleCreateContract}>
                    Accept Request
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultStaffLayout>
  );
};

export default DesignAndSample;
