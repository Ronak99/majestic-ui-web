import TextMorph from "@/app/components/text-morph";

type Props = {
  currentTitle: string;
  previousTitle?: string;
  subtitle: string;
};

export default function Heading({
  currentTitle,
  previousTitle,
  subtitle,
}: Props) {
  return (
    <>
      {/* <TextMorph currentText={previousTitle} targetText={currentTitle} /> */}
      <h1 className="text-3xl font-bold tracking-tight">{currentTitle}</h1>

      <h4 className="text-md text-muted-foreground max-w-[450px] mt-3">
        {subtitle}
      </h4>
    </>
  );
}
