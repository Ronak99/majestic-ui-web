import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState } from "react";

export default function PreviewAndCodeView() {
  const [selectedTab, setSelectedTab] = useState<string>("preview");

  const onTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <Tabs
      defaultValue={selectedTab}
      onValueChange={onTabChange}
      className="flex flex-col items-start justify-between mt-12"
    >
      <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0 mb-6">
        <TabsTrigger
          value="preview"
          className={`inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none`}
        >
          Preview
        </TabsTrigger>

        <TabsTrigger
          value="code"
          className={`inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none`}
        >
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="w-full">
        <Card className=" h-[350px] rounded">
          <iframe
            className="h-full w-full rounded-lg"
            src="https://majestic-flutter-web.web.app"
          />
        </Card>
      </TabsContent>
      <TabsContent value="code">
        <Card>Code</Card>
      </TabsContent>
    </Tabs>
  );
}
