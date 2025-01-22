export default function Header() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full border-l border-r m-auto lg:max-w-[1536px] p-5 flex justify-between">
        <div className="flex">
          <div>Logo</div>
          <div className="gap-4 flex">
            {["Docs", "Components"].map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        </div>
        <div className="flex">
          <p>Input</p>
          <div>github</div>
        </div>
      </div>
    </header>
  );
}
