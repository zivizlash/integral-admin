"use client";
import { userAtom } from "@/logic/api/atoms";
import { ADMIN_GET_CATEGORIES, ADMIN_GET_PATHS, ADMIN_GETUSER, ADMIN_GETUSERS } from "@/logic/api/endpoints";
import axios from "@/logic/api/api";
import React, { useEffect, useState } from "react";
import { User } from "@/logic/models/definition";
import Loading from "@/app/components/loading";
import { CheckIcon, ChevronDownIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import AuthLoading from "@/app/components/auth-loading";


import { Description, Field, Fieldset, Input, Label, Legend, Listbox, ListboxButton, ListboxOption, ListboxOptions, Select, Tab, TabGroup, TabList, TabPanel, TabPanels, Textarea } from '@headlessui/react'
import { useParams, useRouter } from "next/navigation";

type AccessMode = 0 | 1 | 2;

type UserPathItem = {
  categoryId: number,
  accessMode: AccessMode
};

type UserPaths = {
  items: UserPathItem[]
};

type UserCategories = {
  restrictedRead: number[],
  restrictedWrite: number[]
};

const people = [
  { id: 1, name: 'Tom Cook' },
  { id: 2, name: 'Wade Cooper' },
  { id: 3, name: 'Tanya Fox' },
  { id: 4, name: 'Arlene Mccoy' },
  { id: 5, name: 'Devon Webb' },
]

export default function UserDetailed() {
  const params = useParams();
  const userId: number = +params.id;
  const [user, setUser] = useState<User>();
  const [paths, setPaths] = useState<UserPaths>();
  const [categories, setCategories] = useState<UserCategories>();
  const [selected, setSelected] = useState(people[1])

  useEffect(() => {
    axios.get(ADMIN_GETUSER(userId))
      .then(res => {
        setUser(res.data.value);
      });

    axios.get(ADMIN_GET_PATHS(userId))
      .then(res => {
        setPaths(res.data.value);
      });

    axios.get(ADMIN_GET_CATEGORIES(userId))
      .then(res => {
        setCategories(res.data.value);
      });
  }, []);

  const canBeRendered = user != null && paths != null && categories != null;

  const createEdit = () => {
    return (
      <div className="w-full max-w-lg px-4">
        <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
          <Legend className="text-base/7 font-semibold text-white">Shipping details</Legend>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Street address</Label>
            <Input
              className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Country</Label>
            <Description className="text-sm/6 text-white/50">We currently only ship to North America.</Description>
            <Listbox value={selected} onChange={setSelected}>
              <ListboxButton
                className={clsx(
                  'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )}
              >
                {selected.name}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  'w-[var(--button-width)] rounded-xl border border-white/50 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
                  'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
              >
                {people.map((person) => (
                  <ListboxOption
                    key={person.name}
                    value={person}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                  >
                    <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                    <div className="text-sm/6 text-white">{person.name}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Delivery notes</Label>
            <Description className="text-sm/6 text-white/50">
              If you have a tiger, we'd like to know about it.
            </Description>
            <Textarea
              className={clsx(
                'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
              rows={3}
            />
          </Field>
        </Fieldset>
      </div>
    );
  };

  const createLogs = () => {
    return (
      <div>
      </div>
    );
  };

  const pages = [
    {
      name: "Редактирование",
      component: createEdit,
    },
    {
      name: "Логи",
      component: createLogs
    }
  ];

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-md">
        {!canBeRendered
          ? <AuthLoading />
          : <TabGroup>
            <TabList className="flex gap-4">
              {pages.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {pages.map(({ name, component }) => (
                <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                  <ul>
                    {component()}
                  </ul>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        }
      </div>
    </div>
  )
}