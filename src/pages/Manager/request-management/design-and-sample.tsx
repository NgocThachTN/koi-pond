import React, { useEffect, useState, useMemo } from 'react';
import DefaultManagerLayout from '@/layouts/defaultmanager';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination, Input, Card, CardBody, CardHeader, Divider, Image, Tabs, Tab } from "@nextui-org/react";
import { SearchIcon, EyeIcon } from '@nextui-org/shared-icons';
import { getUserRequestsApi, UserRequest, createContractByRequestDesignApi, createContractBySampleDesignApi } from '@/apis/user.api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

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
    description: ''
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
      description: request.description
    });
    setIsCreateContractModalOpen(true);
  };

  const generatePDF = (contractData: any, selectedRequest: UserRequest) => {
    const doc = new jsPDF();
    
    // Company name as header
    doc.setFontSize(24);
    doc.setTextColor(0, 51, 102); // Dark blue
    doc.text('Your Company Name', 105, 20, { align: 'center' });
    
    // Contract title
    doc.setFontSize(22);
    doc.text('CONTRACT AGREEMENT', 105, 40, { align: 'center' });
    
    // Add Koi Pond Construction Contract Agreement
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204); // Light blue
    doc.text('KOI POND CONSTRUCTION', 105, 70, { align: 'center' });
    doc.text('CONTRACT AGREEMENT', 105, 80, { align: 'center' });

    // Basic contract information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(`Contract ID: ${contractData.contractId}`, 20, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 107);
    
    // Parties information
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('PARTIES TO THE CONTRACT', 20, 120);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Company:', 20, 130);
    doc.text('Your Company Name', 70, 130);
    doc.text('Address:', 20, 137);
    doc.text('Your Company Address', 70, 137);
    
    doc.text('Client:', 20, 147);
    doc.text(selectedRequest.users.$values[0].name, 70, 147);
    doc.text('Address:', 20, 154);
    doc.text(selectedRequest.users.$values[0].address, 70, 154);
    
    // Contract details
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('CONTRACT DETAILS', 20, 170);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Contract Name: ${contractData.contractName}`, 20, 180);
    doc.text(`Start Date: ${contractData.contractStartDate}`, 20, 187);
    doc.text(`End Date: ${contractData.contractEndDate}`, 20, 194);
    
    // Contract description
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('DESCRIPTION', 20, 210);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const descriptionLines = doc.splitTextToSize(contractData.description, 170);
    doc.text(descriptionLines, 20, 220);
    
    // Product/Service details
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('PRODUCT/SERVICE DETAILS', 20, 250);
    
    // Use autoTable for product/service information
    const productData = [];
    if (selectedRequest.designs.$values.length > 0) {
      const design = selectedRequest.designs.$values[0];
      productData.push(['Design Name', design.designName]);
      productData.push(['Construction Type', design.constructionTypeName]);
      productData.push(['Size', design.designSize]);
      productData.push(['Price', `$${design.designPrice}`]);
    } else if (selectedRequest.samples.$values.length > 0) {
      const sample = selectedRequest.samples.$values[0];
      productData.push(['Sample Name', sample.sampleName]);
      productData.push(['Construction Type', sample.constructionTypeName]);
      productData.push(['Size', sample.sampleSize]);
      productData.push(['Price', `$${sample.samplePrice}`]);
    }
    
    (doc as any).autoTable({
      startY: 260,
      head: [['Item', 'Details']],
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    
    // Add new page for materials pricing
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('KOI POND CONSTRUCTION MATERIALS PRICING', 105, 20, { align: 'center' });

    const koiPondMaterials = [
      { item: "Waterproof Concrete", unit: "m³", unitPrice: 150, quantity: 5, total: 750 },
      { item: "Pond Tiles", unit: "m²", unitPrice: 25, quantity: 20, total: 500 },
      { item: "PVC Pipes (50mm diameter)", unit: "m", unitPrice: 5, quantity: 30, total: 150 },
      { item: "Water Pump", unit: "piece", unitPrice: 200, quantity: 1, total: 200 },
      { item: "Underwater LED Lights", unit: "piece", unitPrice: 30, quantity: 5, total: 150 },
      { item: "Filter Mesh", unit: "m²", unitPrice: 10, quantity: 10, total: 100 },
      { item: "Skimmer", unit: "piece", unitPrice: 80, quantity: 1, total: 80 },
      { item: "EPDM Liner", unit: "m²", unitPrice: 15, quantity: 25, total: 375 },
      { item: "Decorative Gravel", unit: "kg", unitPrice: 2, quantity: 100, total: 200 },
      { item: "Waterproof Silicone", unit: "tube", unitPrice: 10, quantity: 5, total: 50 },
    ];

    (doc as any).autoTable({
      startY: 30,
      head: [['Item', 'Unit', 'Unit Price ($)', 'Quantity', 'Total ($)']],
      body: koiPondMaterials.map(item => [
        item.item,
        item.unit,
        item.unitPrice.toFixed(2),
        item.quantity,
        item.total.toFixed(2)
      ]),
      foot: [['', '', '', 'Grand Total:', koiPondMaterials.reduce((sum, item) => sum + item.total, 0).toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Add notes
    const finalY = (doc as any).lastAutoTable.finalY || 30;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Notes:', 14, finalY + 10);
    doc.text('- Prices do not include VAT', 20, finalY + 20);
    doc.text('- Prices may vary depending on market conditions and specific customer requirements', 20, finalY + 30);
    doc.text('- This price list is for reference only', 20, finalY + 40);

    // Signatures
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('SIGNATURES', 105, finalY + 60, { align: 'center' });
    
    doc.line(20, finalY + 80, 90, finalY + 80); // Company signature line
    doc.text('Company Representative', 55, finalY + 85, { align: 'center' });
    
    doc.line(120, finalY + 80, 190, finalY + 80); // Client signature line
    doc.text('Client', 155, finalY + 85, { align: 'center' });

    return doc;
  };

  const handleCreateContract = async () => {
    if (!selectedRequest) return;

    const contractDataToSend = {
      requests: [{
        users: selectedRequest.users.$values,
        designs: selectedRequest.designs.$values,
        samples: selectedRequest.samples.$values,
        requestName: selectedRequest.requestName,
        description: selectedRequest.description,
      }],
      ...contractData,
      status: "Pending",
    };

    try {
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
        
        // Generate PDF
        const pdfDoc = generatePDF(contractData, selectedRequest);
        
        // Create Blob from PDF
        const pdfBlob = pdfDoc.output('blob');
        
        // Automatically download PDF
        saveAs(pdfBlob, `${contractData.contractName}.pdf`);
        
        setIsCreateContractModalOpen(false);
        setIsModalOpen(true);
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
            <span className="truncate max-w-xs">{request.description || 'N/A'}</span>
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
              Create Contract
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
    <DefaultManagerLayout>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedRequest.users.$values.map((user, index) => (
                            <Card key={index} className="max-w-[340px]">
                              <CardHeader className="justify-between">
                                <div className="flex gap-5">
                                  <Image
                                    alt="User avatar"
                                    height={40}
                                    radius="sm"
                                    src={user.avatarUrl || "https://via.placeholder.com/40"}
                                    width={40}
                                  />
                                  <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{user.name}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">{user.email}</h5>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardBody className="px-3 py-0 text-small text-default-400">
                                <p><strong>User ID:</strong> {user.$id}</p>
                                <p><strong>Username:</strong> {user.userName}</p>
                                <p><strong>Phone:</strong> {user.phoneNumber}</p>
                                <p><strong>Address:</strong> {user.address}</p>
                                <p><strong>Role ID:</strong> {user.roleId}</p>
                                {/* We don't display the password for security reasons */}
                              </CardBody>
                            </Card>
                          ))}
                        </div>
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
                        onChange={(e) => setContractData({...contractData, contractName: e.target.value})}
                        className="mb-2"
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        value={contractData.contractStartDate}
                        onChange={(e) => setContractData({...contractData, contractStartDate: e.target.value})}
                        className="mb-2"
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={contractData.contractEndDate}
                        onChange={(e) => setContractData({...contractData, contractEndDate: e.target.value})}
                        className="mb-2"
                      />
                      <Input
                        label="Description"
                        value={contractData.description}
                        onChange={(e) => setContractData({...contractData, description: e.target.value})}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleCreateContract}>
                    Create Contract
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultManagerLayout>
  );
};

export default DesignAndSample;