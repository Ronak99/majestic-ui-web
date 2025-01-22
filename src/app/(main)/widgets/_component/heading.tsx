type Props = {
  title: string;
  subtitle: string;
};

export default function Heading({ title, subtitle }: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <h4 className="text-md text-muted-foreground max-w-[346px]">
        {subtitle}
      </h4>
    </>
  );
}
