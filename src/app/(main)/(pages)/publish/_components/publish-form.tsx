import Loading from "@/app/components/loading";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GithubScanResult, PublishFormSchema, WIDGET_TYPE } from "@/util/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRegistryAndContent } from "@/actions/registry";
import { getUser } from "@/actions/auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublishForm({
  scanResult,
  onBackButtonTap,
}: {
  scanResult: GithubScanResult;
  onBackButtonTap: () => void;
}) {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof PublishFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PublishFormSchema),
    defaultValues: {
      name: scanResult.name,
      label: scanResult.label,
      preview_url: scanResult.previewUrl,
      type: "widget",
    },
  });

  const handleSubmit = async (values: z.infer<typeof PublishFormSchema>) => {
    setIsPublishing(true);
    const user = await getUser();
    try {
      await createRegistryAndContent({
        authorId: user!.id,
        demo: "Demo will be available soon.",
        dependencies: scanResult.dependencies,
        description: scanResult.description,
        files: scanResult.files,
        label: values.label,
        name: scanResult.name,
        type: values.type,
        preview_url: values.preview_url,
      });

      toast("Component Submitted.", {
        description:
          "Thank you for your contribution, your component has been published submitted successfully.",
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log(e);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card className="flex h-[550px] mt-4">
      <Form {...form}>
        <form
          className="flex flex-col w-full items-center"
          onSubmit={form.handleSubmit(handleSubmit, (error) => {
            console.log(error);
          })}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between font-medium border-b px-4 py-4 w-full">
            <div className="flex gap-2 items-center">
              <Button
                size={"icon"}
                onClick={onBackButtonTap}
                variant={"ghost"}
                className="text-blue-500 p-0"
              >
                <ArrowLeft />
              </Button>
              <p className="font-semibold text-lg">Details Form</p>
            </div>
            {
              <button
                className="flex items-center justify-center rounded-lg bg-white text-black font-semibold text-sm py-1 cursor-pointer w-20"
                type="submit"
              >
                {!isPublishing && "Publish"}
                {isPublishing && <Loading size="sm" variant="dark" />}
              </button>
            }
          </div>

          {/* Publish Form View */}
          <div className="flex flex-col gap-6 h-full w-full px-24 justify-center">
            <FormField
              disabled={true}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Package Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isPublishing}
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isPublishing}
              control={form.control}
              name="preview_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Preview URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Preview URL" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Categorize your widget
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {WIDGET_TYPE.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e[0].toUpperCase() +
                              e.substring(1, e.length).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Card>
  );
}
