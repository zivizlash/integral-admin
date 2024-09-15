"use client";
import { userAtom } from "@/logic/api/atoms";
import { ADMIN_GET_CATEGORIES, ADMIN_GET_PATHS, ADMIN_GETUSER, ADMIN_GETUSERS, ADMIN_UPDATE_CATEGORIES, ADMIN_UPDATE_PATH, ADMIN_UPDATEUSER, CATEGORIES_GET, PATH_BROWSE } from "@/logic/api/endpoints";
import axios, { axiosInstance } from "@/logic/api/api";
import React, { useEffect, useState } from "react";
import { User } from "@/logic/models/definition";
import Loading from "@/app/components/loading";
import { CheckIcon, ChevronDownIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";
import AuthLoading from "@/app/components/auth-loading";


import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Fieldset, Input, Label, Legend, Listbox, ListboxButton, ListboxOption, ListboxOptions, ListboxSelectedOption, Select, Tab, TabGroup, TabList, TabPanel, TabPanels, Textarea } from '@headlessui/react'
import { useParams, useRouter } from "next/navigation";
import { normalizeRepeatedSlashes } from "next/dist/shared/lib/utils";

type AccessMode = 0 | 1 | 2;

type UserRole = 0 | 1 | 2;

type UpdateStatus = "none" | "progress" | "success" | "fail";

const availableRoles: UserRole[] = [0, 1, 2];

const formatRole = (role: number) => {
  switch (role) {
    case 0:
      return "Доступ на чтение";
    case 1:
      return "Доступ на изменение"
    case 2:
      return "Администратор";
  }
};

type UserPathItem = {
  categoryId: number,
  accessMode: AccessMode
};

type UserPaths = {
  allowedPaths: string[]
};

type DocumentEntry = {
  path: string,
  name: string,
  isDirectory: boolean
};

type UserCategories = {
  restrictedRead: number[],
  restrictedWrite: number[]
};

type CategoryInfo = {
  id: number,
  name: string | null
};

const selectRoleColor = (role: number) => {
  switch (role) {
    case 0:
      return "text-green-500/75";
    case 1:
      return "text-amber-500/75"
    case 2:
      return "text-rose-500/75";
    default:
      return "";
  }
};

const normalizeLastSlash = (input: string): string => {
  return (input.endsWith("/") || input.endsWith("\\"))
    ? normalizeLastSlash(input.substring(0, input.length - 1))
    : input;
}

const removeLastFolder = (input: string) => {
  const splitted = (input ?? "").split("/").flatMap(s => s.split("\\"));
  return splitted.slice(0, splitted.length - 1).join('/');
};

export default function UserDetailed() {
  const params = useParams();
  const userId: number = +params.id;
  const [user, setUser] = useState<User>();
  const [paths, setPaths] = useState<UserPaths>();
  const [categories, setCategories] = useState<UserCategories>();
  const [selectedRole, setSelectedRole] = useState<UserRole>(0);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("none");

  const [allCategories, setAllCategories] = useState<CategoryInfo[] | null>(null);
  const [categoriesQuery, setCategoriesQuery] = useState<string | null>("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryInfo[]>([]);
  const [categoriesUpdate, setCategoriesUpdate] = useState<CategoryInfo[]>([]);
  const [categoriesInit, setCategoriesInit] = useState(false);

  const [pathUpdate, setPathUpdate] = useState<string[] | null>();
  const [isPathFetching, setIsPathFetching] = useState(false);
  const [fetchedPath, setFetchedPath] = useState("");
  const [currentPathes, setCurrentPathes] = useState<string[] | null>([]);

  const [pathQuery, setPathQuery] = useState<string | null>("");

  const [isPathFocused, setIsPathFocused] = useState(false);
  const [isCategoriesFocused, setIsCategoriesFocused] = useState(false);

  useEffect(() => {
    axios.get(ADMIN_GETUSER(userId))
      .then(res => {
        const user = res.data.value;
        setUser(user);
        setSelectedRole(user.role);
      });

    axios.get(ADMIN_GET_PATHS(userId))
      .then(res => {
        setPaths(res.data.value);
        setPathUpdate(res.data.value.allowedPaths);
      });

    axios.get(ADMIN_GET_CATEGORIES(userId))
      .then(res => {
        setCategories(res.data.value);
      });

    axios.get(CATEGORIES_GET)
      .then(res => {
        setAllCategories(res.data.value);
      });
  }, []);

  useEffect(() => {

  }, [categories, allCategories]);

  useEffect(() => {
    setIsPathFetching(true);
    axios.get(PATH_BROWSE(fetchedPath))
      .then(res => {
        const entries: DocumentEntry[] = res.data.value;

        const dirs = entries
          .filter(entry => entry.isDirectory)
          .map(path => (path.path ?? "").trim() !== ""
            ? path.path + "/" + path.name
            : path.name);

        console.log("found dirs", dirs);
        setCurrentPathes(dirs.length == 0 ? null : dirs);
        setIsPathFetching(false);
      });

  }, [fetchedPath]);

  useEffect(() => {
    if (categoriesInit || allCategories == null || categories == null) {
      return;
    }
    setCategoriesInit(true);

    const allRestricted = categories!.restrictedRead
      .concat(categories!.restrictedWrite);
    const current = allCategories!
      .filter(c => allRestricted.find(x => x === c.id));

    const filtered = allCategories?.filter(c => {
      return !current.find(u => u.id == c.id) &&
        c.name?.toLowerCase().includes(categoriesQuery?.toLowerCase()!);
    });

    setFilteredCategories(filtered.slice(0, 10));
    setCategoriesUpdate(current);
  }, [allCategories, categories]);

  const getAvailableCategories = (filtered: CategoryInfo[] | null) => {
    const update = filtered ?? categoriesUpdate;

    return allCategories?.filter(c => {
      return !update.find(u => u.id == c.id) &&
        c.name?.toLowerCase().includes(categoriesQuery?.toLowerCase()!);
    });
  };

  useEffect(() => {
    const query = categoriesQuery?.trim()?.toLowerCase() ?? "";

    if (query === "") {
      console.log("query is empty")
      setFilteredCategories(allCategories?.slice(0, 10) ?? []);
      return;
    }

    const categories = getAvailableCategories(categoriesUpdate);
    console.log("found categories", categories);
    setFilteredCategories(categories?.slice(0, 10) ?? []);
  }, [categoriesQuery]);

  useEffect(() => {
    const splitted = (pathQuery ?? "").split("/").flatMap(s => s.split("\\"));
    const raw = splitted.slice(0, splitted.length - 1);
    const path = raw.join('/');

    setFetchedPath(path);
    console.log("new fetched value", path);
  }, [pathQuery]);

  const updateUser = () => {
    setUpdateStatus("progress");

    const updates = [false, false, false];

    const setUpdate = (index: number) => {
      updates[index] = true;
      if (updates.reduce((prev, curr) => prev && curr)) {
        setUpdateStatus("success");
        // setCategoriesUpdate(getAvailableCategories(categoriesUpdate) ?? []);
      }
    };

    axios.put(ADMIN_UPDATEUSER, {
      userId: user?.id,
      role: selectedRole
    }).then(() => {
      setUpdate(0);
    });
    
    axios.put(ADMIN_UPDATE_CATEGORIES(user!.id), {
      items: categoriesUpdate.map(c => {
        return {
          categoryId: c.id, access: 0
        }
      })
    }).then(() => {
      setUpdate(1);
    });

    axios.put(ADMIN_UPDATE_PATH(user!.id), {
      allowedPaths: pathUpdate
    }).then(() => {
      setUpdate(2);
    })
  };

  const close = () => {
    setUpdateStatus("none");
  };

  const removePath = (path: string) => {
    if (pathUpdate != null) {
      setPathUpdate(pathUpdate.filter(p => {
        return p != path;
      }));
    }
  };

  const addPath = () => {
    const path = normalizeRepeatedSlashes(pathQuery!);
    const update = pathUpdate ?? [];
    setPathQuery("");
    setPathUpdate([...update, path]);
  };

  const removeCategory = (category: CategoryInfo) => {
    setCategoriesUpdate(categoriesUpdate.filter(uc => uc != category));

    const available = [...getAvailableCategories(null) ?? [], category];
    setFilteredCategories(available);
  };

  const addCategory = (category: CategoryInfo) => {
    console.log("found category", category);

    if (category != null) {
      setCategoriesUpdate([...categoriesUpdate, category]);
    }

    const available = (getAvailableCategories(null) ?? [])
      .filter(ac => ac.id !== category.id);

    setFilteredCategories(available);
  };

  const canBeRendered = user != null && paths != null
    && categories != null && allCategories != null;

  const createEdit = () => {
    return (
      <div className="w-full">
        <Fieldset className="space-y-6 p-4">
          <Field>
            <Label className="text-sm/6 font-medium text-white">Пользователь</Label>
            <Description className="text-sm/6 text-white/50">
              Пока не редактируется
            </Description>
            <Input disabled
              value={user?.login}
              className={clsx(
                'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Роль</Label>
            <Description className="text-sm/6 text-white/50">
              Определяет возможности пользователя в системе
            </Description>
            <Listbox value={selectedRole} onChange={setSelectedRole}>
              <ListboxButton
                className={clsx(
                  'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 mt-1 text-left text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )}
              >
                <div className={clsx(selectRoleColor(selectedRole))}>
                  {formatRole(selectedRole)}
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
                  'w-[var(--button-width)] rounded-xl border-2 border-zinc-700 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none backdrop-blur-md',
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
                    <div className={clsx(
                      'ml-1.5 text-sm/6',
                      selectRoleColor(role)
                    )}>
                      {formatRole(role)}
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
          <div className="rounded-xl bg-white/5 p-4">
            <Field>
              <Label className="text-sm/6 font-medium text-white">
                Разрешенные пути
              </Label>
              <Description className="text-sm/6 text-white/50">
                При добавлении разрешенного пути он становится автоматически запрещенным для
                всех остальных пользователей (помимо администраторов), которые не имеют разрешения на
                данный путь. Разрешение действует на все вложенные пути
              </Description>
            </Field>
            <Field>
              <div className="pt-1">
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
                          displayValue={(path: string) => {
                            if (path == null || path == "") {
                              return isPathFocused ? "" : "Введите или выберите путь";
                            }

                            return path;
                          }}
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
                    )} disabled={updateStatus !== "none"}>
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
            </Field>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <Field>
              <Label className="text-sm/6 font-medium text-white">
                Запрещенные категории
              </Label>
              <Description className="text-sm/6 text-white/50">
                Объекты из запрещенных категорий не будут отображаться пользователю
              </Description>
            </Field>
            <Field>
              <div className="pt-1">
                <Combobox immediate value={categoriesQuery} 
                  onChange={(query) => setCategoriesQuery(query)}
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
              </div>
            </Field>
          </div>
          <Button onClick={updateUser} className={clsx(
            'text-center block w-full rounded-lg border-2 border-zinc-700 hover:border-zinc-600 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'mt-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )} disabled={updateStatus !== "none"}>
            Обновить
          </Button>
          {/* <Field>
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
          </Field> */}
        </Fieldset>
        {/* href="/panel/users/create" */}
        <Dialog open={updateStatus == "fail" || updateStatus == "success"} as="div"
          className="relative z-10 focus:outline-none" onClose={close}>
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 z-10 w-screen">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              >
                <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                  {updateStatus == "fail" ? "Произошла ошибка" : "Успешно"}
                </DialogTitle>
                <p className="mt-2 text-sm/6 text-white/50">
                  {updateStatus == "fail" ? "Повторите попытку позже" : "Пользователь обновлен"}
                </p>
                <div className="mt-4">
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                    onClick={close}
                  >
                    Ок
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
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
    // {
    //   name: "Логи",
    //   component: createLogs
    // }
  ];

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full p-4 max-w-2xl">
        {!canBeRendered
          ? <AuthLoading />
          : (<div>
            <TabGroup>
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
          </div>)
        }
      </div>
    </div>
  )
}
