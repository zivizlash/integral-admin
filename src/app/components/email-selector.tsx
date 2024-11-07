import { Label, Description, Input } from "@headlessui/react";
import clsx from "clsx";

export const EmailSelector = ({ email, setEmail }: Readonly<{
  email: string,
  setEmail: (email: string) => void
}>) => {
  return <div>
    <Label className="text-sm/6 font-medium text-white">Email</Label>
    <Description className="text-sm/6 text-white/50">
      Используется для восстановления пароля
    </Description>
    <Input
      type="text"
      onChange={e => setEmail(e.target.value ?? "")}
      placeholder="Не задано"
      value={email}
      className={clsx(
        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
      )}
    />
  </div>;
};
