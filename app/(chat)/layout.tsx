import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full px-6 pt-2 flex flex-col flex-grow h-dvh overflow-hidden">
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}
