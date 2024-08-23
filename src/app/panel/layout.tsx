import SideNav from "../components/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="">
        <SideNav />
      </div>
      <div className="flex-grow px-8">
        <div className="rounded-xl bg-white/5 p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
