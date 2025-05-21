
import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';

const orderSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  printType: z.string(),
  copies: z.coerce.number().min(1), // Convert string to number during validation
  paperSize: z.string(),
  specialInstructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const OrderForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      printType: "blackAndWhite",
      copies: 1, // Changed from string "1" to number 1
      paperSize: "a4",
      specialInstructions: "",
    },
  });

  const handleFilesChange = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const onSubmit = async (data: OrderFormValues) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file to print.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would upload the files to a server
    // Here we'll simulate saving to local storage for demo purposes
    const orderData = {
      ...data,
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    // Save the order in local storage
    const existingOrders = JSON.parse(localStorage.getItem('xeroxOrders') || '[]');
    localStorage.setItem('xeroxOrders', JSON.stringify([...existingOrders, orderData]));

    // Show success message
    toast({
      title: "Order submitted successfully!",
      description: `Your order ID is ${orderData.orderId}`,
    });

    // Redirect to confirmation page or home
    navigate('/');
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="printType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Print Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select print type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blackAndWhite">Black & White</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="premium">Premium Color</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Copies</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 50, 100].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paperSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Size</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any special instructions here..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Upload Files</h3>
            <FileUploader onFilesChange={handleFilesChange} />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full md:w-auto bg-xerox-600 hover:bg-xerox-700">
              Submit Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
