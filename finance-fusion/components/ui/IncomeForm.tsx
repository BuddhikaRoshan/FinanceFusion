"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { incomeSchema } from "@/schemas/income.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type FormValues = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  onSubmit: (data: z.infer<typeof incomeSchema>) => void;
  defaultValues?: Partial<z.infer<typeof incomeSchema>>;
  userId: string;
}

export const IncomeForm = ({
  onSubmit,
  defaultValues,
  userId,
}: IncomeFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const preparedDefaults: Partial<FormValues> = {
    ...defaultValues,
    date: defaultValues?.date ? new Date(defaultValues.date) : undefined,
    userId: defaultValues?.userId ?? userId,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: preparedDefaults,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit({
        ...data,
        userId: userId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <Form {...form}>
      <DialogTitle className="mb-4">
        {defaultValues ? "Edit Income" : "Add New Income"}
      </DialogTitle>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Salary, Freelance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden field for userId */}
        <input type="hidden" {...form.register("userId")} value={userId} />

        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
