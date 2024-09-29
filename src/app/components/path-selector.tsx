import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";

export const PathSelector = ({ 
  pathQuery, 
  setPathQuery,
  currentPathes,
  isPathFetching,
  addPath,
  pathUpdate,
  removePath
}: Readonly<{ 
  pathQuery: string | undefined,
  setPathQuery: (pathQuery: string) => void,
  currentPathes: string[] | null,
  isPathFetching: boolean,
  addPath: () => void,
  pathUpdate: string[] | undefined,
  removePath: (path: string) => void
}>) => {
  const [isPathFocused, setIsPathFocused] = useState(false);

  return <div className="pt-1">
    <div className="flex flex-row justify-center items-center">
      <div className="grow pr-2">
        <Combobox immediate value={pathQuery}
          onChange={(value: string) => setPathQuery(value)}
          onClose={() => setIsPathFocused(false)}>
          <div className="relative">
            <ComboboxInput
              className={clsx(
                "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
                "data-[focus]:outline-white/25"
              )}
              onFocus={() => setIsPathFocused(true)}
              placeholder="Введите или выберите путь"
              onChange={(event) => setPathQuery(event.target.value)}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
            </ComboboxButton>
          </div>
          <ComboboxOptions
            anchor="bottom" transition
            className={clsx(
              'w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1',
              '[--anchor-gap:var(--spacing-1)] empty:invisible',
              'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
              'backdrop-blur-md'
            )}
          >
            {(currentPathes) == null
              ? <div className="items-center p-8 m-auto text-white/50">
                {isPathFetching ? "Поиск..." : "Подпапки не найдены"}
              </div>
              : currentPathes.map(path => (
                <ComboboxOption
                  key={path}
                  value={path}
                  className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                >
                  <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                  <div className="text-sm/6 text-white">{path}</div>
                </ComboboxOption>
              ))}
          </ComboboxOptions>
        </Combobox>
      </div>
      <div>
        <Button onClick={addPath} className={clsx(
          'text-center block w-full rounded-lg border-2 border-zinc-700 hover:border-zinc-600 ',
          'hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2',
          'data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}>
          Добавить путь
        </Button>
      </div>
    </div>
    <div className="mt-3 rounded-xl bg-white/5 p-3">
      {pathUpdate?.length == 0
        ? <div className="w-full"><p className="italic text-white/50 text-sm">Список путей пуст</p></div>
        : <ul>
          {pathUpdate?.map(path => {
            return <li key={path} className="relative rounded-md p-0.5 text-sm/6 transition hover:bg-white/5">
              <div className="flex w-full flex-row p-2 items-center">
                <div className="w-full grow">{path}</div>
                <div>
                  <XMarkIcon onClick={() => removePath(path)} className="size-4 fill-white/60 hover:fill-red-700/60" />
                </div>
              </div>
            </li>
          })}
        </ul>
      }
    </div>
  </div>
}
