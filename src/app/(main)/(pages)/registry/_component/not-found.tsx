export default function NotFound({ componentName }: { componentName: string }) {
  return (
    <div
      className="rounded-xl border px-8 py-16 md: p-4 flex justify-center h-full items-center flex-col gap-1 bg-[url(/rdr.jpg)] bg-fixed bg-center bg-no-repeat relative"
      style={{
        "background-image":
          "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)), url(/rdr.jpg)",
      }}
    >
      <img src="/not-found.png" height={30} width={70} className="mb-4" />
      <p className="text-2xl text-white font-semibold">Component Not Found!</p>
      <p className="text-lg text-muted-foreground text-center">
        No component goes by the name of <b>{componentName}</b> around here.
      </p>
    </div>
  );
}
