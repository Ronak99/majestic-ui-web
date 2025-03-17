import TextMorph from "@/app/components/text-morph";
import AuthorView from "./author_view";

type Props = {
  currentTitle: string;
  previousTitle?: string;
  subtitle?: string;
  githubUsername?: string | null;
};

export default function Heading({
  currentTitle,
  previousTitle,
  subtitle,
  githubUsername,
}: Props) {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">{currentTitle}</h1>

          <h4 className="text-md text-muted-foreground max-w-[450px] mt-3">
            {subtitle}
          </h4>
        </div>
        {githubUsername && <AuthorView githubUsername={githubUsername} />}
      </div>
    </>
  );
}
