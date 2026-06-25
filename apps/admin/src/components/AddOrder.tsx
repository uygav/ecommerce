"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const formSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required!" }),
  email: z.string().email({ message: "Valid email is required!" }),
  amount: z.number().min(1, { message: "Amount must be at least 1!" }),
  status: z.enum(["success", "failed"]),
  productName: z.string().min(1, { message: "Product name is required!" }),
  productQuantity: z.number().min(1, { message: "Quantity must be at least 1!" }),
  productPrice: z.number().min(1, { message: "Price must be at least 1!" }),
});

const AddOrder = () => {
  const { getToken } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      email: "",
      amount: 0,
      status: "success",
      productName: "",
      productQuantity: 1,
      productPrice: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: data.userId,
            email: data.email,
            amount: data.amount,
            status: data.status,
            product: [{ name: data.productName, quantity: data.productQuantity, price: data.productPrice }],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to create order!");
    },
    onSuccess: () => toast.success("Order created successfully"),
    onError: (error) => toast.error(error.message),
  });

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add Order</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit((data) => mutation.mutate(data), (errors) => console.log("Validation errors:", errors))}>
              <FormField control={form.control} name="userId" render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (cents)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>e.g. 1000 = $10.00</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productQuantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price (cents)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={mutation.isPending} className="disabled:opacity-50 disabled:cursor-not-allowed">
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddOrder;
