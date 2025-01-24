import Image from "next/image";
import Link from "next/link";

type Props = {
  showSideBorder: boolean;
};

export default function Header({ showSideBorder = true }: Props) {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={`w-full m-auto lg:max-w-[1536px] p-5 border-l border-r flex justify-between ${
          showSideBorder ? "" : "border-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          <Link className="flex items-center  gap-2" href={"/"}>
            <Image
              src="/logo.svg"
              alt="Majestic UI Logo"
              width={18}
              height={18}
            />
            <span className="tracking-tight text-lg font-bold">
              majestic-ui
            </span>
          </Link>
          <div className="gap-4 flex">
            {[
              { label: "Docs", value: "introduction" },
              { label: "Widgets", value: "widgets" },
            ].map((e) => (
              <Link
                href={`/${e.value}`}
                key={e.value}
                className="text-muted-foreground text-md"
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>
        {/* <div className="flex">
          <p>Input</p>
          <div>github</div>
        </div> */}
      </div>
    </header>
  );
}
