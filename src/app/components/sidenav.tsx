import Link from 'next/link';
import NavLinks from '@/app/components/nav-links';
import { ArrowLeftStartOnRectangleIcon, PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <header className="flex w-full flex-row p-2 px-5">
      <div className="flex flex-row grow justify-between">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <Link href="/login" className="flex h-[48px] grow items-center justify-center 
          gap-2 rounded-md p-3 text-sm font-medium
          hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          {/* <PowerIcon className="w-6" /> */}
          <ArrowLeftStartOnRectangleIcon className="w-6" />
          <div className="hidden md:block">Выйти</div>
        </Link>
      </div>
    </header>
  );
}
