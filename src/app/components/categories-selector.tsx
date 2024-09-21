import { CategoryInfo } from "@/logic/models/definition";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

export const CategoriesSelector = ({
  categoriesQuery,
  setCategoriesQuery,
  filteredCategories,
  addCategory,
  removeCategory,
  categoriesUpdate
}: Readonly<{
  categoriesQuery: string | null,
  setCategoriesQuery: (query: string | null) => void,
  filteredCategories: CategoryInfo[],
  addCategory: (category: CategoryInfo) => void,
  removeCategory: (category: CategoryInfo) => void,
  categoriesUpdate: CategoryInfo[]
}>) => {
  const [isCategoriesFocused, setIsCategoriesFocused] = useState(false);
 
  return <div className="pt-1">
    <Combobox immediate value={categoriesQuery ?? ""}
      onChange={setCategoriesQuery}
      onClose={() => { setCategoriesQuery(""); setIsCategoriesFocused(false); }}>
      <div className="relative">
        <ComboboxInput
          className={clsx(
            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
            "data-[focus]:outline-white/25"
          )}
          onFocus={() => setIsCategoriesFocused(true)}
          onChange={event => setCategoriesQuery(event.target.value)}
          displayValue={() => {
            if ((categoriesQuery ?? "" === "")) {
              return "";
            }
            return isCategoriesFocused ? "" : "Добавить категорию";
          }}
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
        {filteredCategories == null
          ? <div className="items-center p-8 m-auto text-white/50">
            Категории не найдены
          </div>
          : filteredCategories.map(category => (
            <ComboboxOption
              key={category.id}
              value={category.name}
              onClick={() => addCategory(category)}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
              <div className="text-sm/6 text-white">{category.name}</div>
            </ComboboxOption>
          ))}
      </ComboboxOptions>
    </Combobox>
    <div className="mt-3 rounded-xl bg-white/5 p-3">
      {categoriesUpdate?.length == 0
        ? <div className="w-full"><p className="italic text-white/50 text-sm">Список категорий пуст</p></div>
        : <ul>
          {categoriesUpdate?.map(category => {
            return <li key={category.id} className="relative rounded-md p-0.5 text-sm/6 transition hover:bg-white/5">
              <div className="flex w-full flex-row p-2 items-center">
                <div className="w-full grow">{category.name}</div>
                <div>
                  <XMarkIcon onClick={() => removeCategory(category)} className="size-4 fill-white/60 hover:fill-red-700/60" />
                </div>
              </div>
            </li>
          })}
        </ul>
      }
    </div>
  </div>;
};
