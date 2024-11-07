import { UserRole } from "@/logic/models/definition";
import { formatRole } from "@/logic/tools/formatters";
import { Description, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

const availableRoles: UserRole[] = [0, 1, 2];

export const RoleSelector = ({
  role, setRole
}: Readonly<{
  role: UserRole,
  setRole: (role: UserRole) => void
}>) => {
  return <div>
    <Label className="text-sm/6 font-medium text-white">Роль</Label>
    <Description className="text-sm/6 text-white/50">
      Определяет возможности пользователя в системе
    </Description>
    <Listbox value={role} onChange={setRole}>
      <ListboxButton
        className={clsx(
          'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 mt-1 text-left text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}
      >
        <div className={clsx({
          "text-green-500/75": role === 0,
          "text-amber-500/75": role === 1,
          "text-rose-500/75": role === 2
        })}>
          {formatRole(role)}
        </div>
        <ChevronDownIcon
          className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={clsx(
          'w-[var(--button-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none backdrop-blur-md',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {availableRoles.map((role) => (
          <ListboxOption
            key={role}
            value={role}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
          >
            <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
            <div className={clsx({
              'ml-1.5 text-sm/6': true,
              "text-green-500/75": role === 0,
              "text-amber-500/75": role === 1,
              "text-rose-500/75": role === 2
            })}>
              {formatRole(role)}
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  </div>;
};
