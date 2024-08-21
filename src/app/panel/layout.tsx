import SideNav from "../components/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p=12">
        {children}
      </div>
    </div>
  );
}
