import { Card, CardHeader } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function PreviewAndCodeView({
  selectedWidget,
}: {
  selectedWidget?: Widget;
}) {
  const [selectedTab, setSelectedTab] = useState<string>("preview");

  const onTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const viewDimensions = "h-[720px]";

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

      <div className="w-full relative flex justify-center items-center">
        <Card className={`${viewDimensions}  w-[370px] rounded-[60px]`}>
          <iframe
            className="h-full w-full rounded-[60px]"
            src={`https://majestic-flutter-web.web.app/#/${
              selectedWidget!.name
            }`}
          />
        </Card>
        <Card
          className={`absolute top-0 rounded-lg z-10 w-full transition-opacity duration-500  ${viewDimensions} ${
            selectedTab === "code"
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <CodeBlock
            filename=""
            code={selectedWidget?.demo ?? ""}
            language="dart"
          />
        </Card>
      </div>
    </Tabs>
  );
}
