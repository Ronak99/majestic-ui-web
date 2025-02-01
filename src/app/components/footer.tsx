import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-grid sticky top-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 px-8">
      <div className="text-center text-sm leading-loose text-muted-foreground">
        Built by{" "}
        <Link
          href="https://ronak99.github.io/portfolio/"
          target="_blank"
          className="underline underline-offset-4"
        >
          Ronak
        </Link>
        . Inspired by{" "}
        <Link
          href="https://x.com/shadcn"
          target="_blank"
          className="underline underline-offset-4"
        >
          shadcn
        </Link>
        .
      </div>
    </footer>
  );
}
