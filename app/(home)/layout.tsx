export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full max-w-[1280px] px-6 flex flex-col flex-grow">
        {children}
      </div>
    </>
  );
}
