
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { fileStorage } from '@/services/fileStorage';

type OrderFile = {
  name: string;
  size: number;
  type: string;
  path?: string; // Added path property for download
};

type Order = {
  orderId: string;
  fullName: string;
  phoneNumber: string;
  printType: string;
  copies: number;
  paperSize: string;
  specialInstructions?: string;
  files: OrderFile[];
  orderDate: string;
  status: string;
};

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch from an API
    const storedOrders = JSON.parse(localStorage.getItem('xeroxOrders') || '[]');
    setOrders(storedOrders);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('xeroxOrders', JSON.stringify(updatedOrders));
    
    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrintTypeName = (type: string) => {
    switch (type) {
      case 'blackAndWhite': return 'Black & White';
      case 'color': return 'Color';
      case 'premium': return 'Premium Color';
      default: return type;
    }
  };
  
  const getPaperSizeName = (size: string) => {
    return size.toUpperCase();
  };

  const handleFileDownload = (file: OrderFile) => {
    try {
      // Get the file path from the file object
      const filePath = file.path;
      
      if (!filePath) {
        toast.error("File path not available");
        return;
      }
      
      // Use the fileStorage service to retrieve the file
      const storedFile = fileStorage.getFile(filePath);
      
      if (storedFile?.data) {
        // Create a URL for the blob
        const url = URL.createObjectURL(storedFile.data);
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        // Trigger download
        a.click();
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Downloading ${file.name}`);
      } else {
        console.error("File not found:", filePath);
        toast.error("File data not available. The file may not be properly stored.");
      }
    } catch (error) {
      console.error('Error handling file download:', error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Print Type</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.fullName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{getPrintTypeName(order.printType)}</TableCell>
                  <TableCell>{order.copies}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedOrder && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.orderId}</DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(selectedOrder.orderDate)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Customer Information</h3>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedOrder.fullName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.phoneNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Order Status</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                      className={selectedOrder.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'pending')}
                    >
                      Pending
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                      className={selectedOrder.status === 'processing' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'processing')}
                    >
                      Processing
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                      className={selectedOrder.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'completed')}
                    >
                      Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                      className={selectedOrder.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'cancelled')}
                    >
                      Cancelled
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700">Print Details</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Print Type</p>
                    <p>{getPrintTypeName(selectedOrder.printType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Copies</p>
                    <p>{selectedOrder.copies}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paper Size</p>
                    <p>{getPaperSizeName(selectedOrder.paperSize)}</p>
                  </div>
                </div>
              </div>
              
              {selectedOrder.specialInstructions && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700">Special Instructions</h3>
                  <p className="mt-2 text-gray-800 whitespace-pre-line">{selectedOrder.specialInstructions}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700">Files ({selectedOrder.files.length})</h3>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.files.map((file, index) => (
                    <div key={index} className="file-item flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-xerox-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="ml-2 text-blue-600"
                        onClick={() => handleFileDownload(file)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrdersList;
