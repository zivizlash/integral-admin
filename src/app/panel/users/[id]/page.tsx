"use client";
import { ADMIN_DELETEUSER, ADMIN_GET_CATEGORIES, ADMIN_GET_PATHS, ADMIN_GETUSER, ADMIN_UPDATE_CATEGORIES, ADMIN_UPDATE_PATH, ADMIN_UPDATEUSER, CATEGORIES_GET, PATH_BROWSE } from "@/logic/api/endpoints";
import axios from "@/logic/api/api";
import { useEffect, useState } from "react";
import { CategoryInfo, DocumentEntry, UpdateStatus, User, UserCategories, UserPaths, UserRole } from "@/logic/models/definition";
import clsx from "clsx";
import AuthLoading from "@/app/components/auth-loading";

import { Button, Description, Field, Fieldset, Label, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useParams, useRouter } from "next/navigation";
import { normalizeRepeatedSlashes } from "next/dist/shared/lib/utils";
import { RoleSelector } from "@/app/components/role-selector";
import { LoginSelector } from "@/app/components/login-selector";
import { PathSelector } from "@/app/components/path-selector";
import { CategoriesSelector } from "@/app/components/categories-selector";
import { UpdateDialog } from "@/app/components/update-dialog";

export default function UserDetailed() {
  const router = useRouter();
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

  const [pathUpdate, setPathUpdate] = useState<string[]>();
  const [isPathFetching, setIsPathFetching] = useState(false);
  const [fetchedPath, setFetchedPath] = useState("");
  const [currentPathes, setCurrentPathes] = useState<string[] | null>([]);

  const [pathQuery, setPathQuery] = useState("");

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
    setIsPathFetching(true);
    axios.get(PATH_BROWSE(fetchedPath))
      .then(res => {
        const entries: DocumentEntry[] = res.data.value;

        const dirs = entries
          .filter(entry => entry.isDirectory)
          .map(path => (path.path ?? "").trim() !== ""
            ? path.path + "/" + path.name
            : path.name);

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
      setFilteredCategories(allCategories?.slice(0, 10) ?? []);
      return;
    }

    const categories = getAvailableCategories(categoriesUpdate);
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

  const removeUser = () => {
    axios.delete(ADMIN_DELETEUSER(user!.id))
      .then(() => {
        router.push("/panel/users");
      });
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
            <LoginSelector login={user?.login} />
          </Field>
          <Field>
            <RoleSelector role={selectedRole} setRole={setSelectedRole} />
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
              <PathSelector pathQuery={pathQuery}
                setPathQuery={setPathQuery}
                currentPathes={currentPathes}
                isPathFetching={isPathFetching}
                addPath={addPath}
                pathUpdate={pathUpdate}
                removePath={removePath}
              />
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
              <CategoriesSelector
                categoriesQuery={categoriesQuery}
                setCategoriesQuery={setCategoriesQuery}
                filteredCategories={filteredCategories}
                addCategory={addCategory}
                removeCategory={removeCategory}
                categoriesUpdate={categoriesUpdate}
              />
            </Field>
          </div>
          <Button onClick={updateUser} className={clsx(
            'text-center block w-full rounded-lg border-2 border-zinc-700 hover:border-zinc-600 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'mt-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )} disabled={updateStatus !== "none"}>
            Обновить
          </Button>
          <Button onClick={removeUser} className={clsx(
            'text-center block w-full rounded-lg border-2 border-rose-950 hover:bg-rose-900 hover:border-rose-900 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'mt-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}>
            Удалить пользователя
          </Button>
        </Fieldset>
        <UpdateDialog
          updateStatus={updateStatus}
          close={close}
        />
      </div>
    );
  };

  const pages = [
    {
      name: "Редактирование",
      component: createEdit,
    }
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
