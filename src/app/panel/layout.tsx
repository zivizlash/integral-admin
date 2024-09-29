import SideNav from "../components/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen justify-stretch">
      <div className="">
        <SideNav />
      </div>
      <div className="flex-grow px-8 min-h-full">
        <div className="rounded-xl bg-white/5 p-3 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
