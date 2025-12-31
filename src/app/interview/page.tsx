"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/app-layout";
import { JOB_ROLES, SENIORITY_LEVELS } from "@/lib/constants";
import { Wand2 } from "lucide-react";

const FormSchema = z.object({
  jobRole: z.string({
    required_error: "Please select a job role.",
  }),
  seniorityLevel: z.string({
    required_error: "Please select a seniority level.",
  }),
});

export default function InterviewSetupPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams({
      jobRole: data.jobRole,
      seniorityLevel: data.seniorityLevel,
    });
    router.push(`/interview/start?${params.toString()}`);
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Mock Interview</CardTitle>
            <CardDescription>
              Tell us about the role you're practicing for, and we'll generate a tailored set of questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JOB_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us tailor the questions to the right domain.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seniorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seniority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a seniority level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SENIORITY_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This adjusts the difficulty and type of questions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">
                  <Wand2 className="mr-2" />
                  Generate Interview
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
