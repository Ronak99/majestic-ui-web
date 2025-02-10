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

export default function PublishForm({
  scanResult,
}: {
  scanResult: GithubScanResult;
}) {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof PublishFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PublishFormSchema),
    defaultValues: {
      name: scanResult.name,
      label: scanResult.label,
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
            <p className="font-semibold text-lg">Details Form</p>
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
          <div className="flex flex-col gap-10 h-full justify-center">
            <div className="flex gap-4">
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
            </div>
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
            <Select name="type">
              <div className="flex flex-col gap-2">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Categorize your widget
                </FormLabel>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
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
              </div>
            </Select>
          </div>
        </form>
      </Form>
    </Card>
  );
}
