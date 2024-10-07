"use client";
import AuthLoading from "@/app/components/auth-loading";
import axios from "@/logic/api/api";
import { ADMIN_DELETEUSER, ADMIN_GET_CATEGORIES, ADMIN_GET_PATHS, ADMIN_GETUSER, ADMIN_UPDATE_CATEGORIES, ADMIN_UPDATE_PATH, ADMIN_UPDATEUSER, CATEGORIES_GET, PATH_BROWSE } from "@/logic/api/endpoints";
import { CategoryInfo, DocumentEntry, UpdateStatus, User, UserCategories, UserPaths, UserRole } from "@/logic/models/definition";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { CategoriesSelector } from "@/app/components/categories-selector";
import { LoginSelector } from "@/app/components/login-selector";
import { PathSelector } from "@/app/components/path-selector";
import { RoleSelector } from "@/app/components/role-selector";
import { UpdateDialog } from "@/app/components/update-dialog";
import { Button, Description, Field, Fieldset, Label, Input } from '@headlessui/react';
import { normalizeRepeatedSlashes } from "next/dist/shared/lib/utils";

export const UserEditor = ({ userId, onRemove }: Readonly<{
  userId: number,
  onRemove: () => void
}>) => {
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pathQuery, setPathQuery] = useState("");

  useEffect(() => {
    axios.get(ADMIN_GETUSER(userId))
      .then(res => {
        const user = res.data.value;
        setUser(user);
        setSelectedRole(user.role);
        setFirstName(user.firstName ?? "");
        setLastName(user.lastName ?? "");
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

    setFilteredCategories(filtered ?? []);
    setCategoriesUpdate(current);
  }, [allCategories, categories]);

  const getAvailableCategories = (filtered: CategoryInfo[] | null = null) => {
    const update = filtered ?? categoriesUpdate;

    const normalizedQuery = categoriesQuery?.trim()?.toLowerCase() ?? "";

    return allCategories?.filter(c => {
      return !update.find(u => u.id == c.id) && (
        normalizedQuery === "" || c.name?.toLowerCase().includes(normalizedQuery)
      );
    });
  };

  useEffect(() => {
    const categories = getAvailableCategories(categoriesUpdate);
    setFilteredCategories(categories ?? []);
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
      role: selectedRole,
      firstName,
      lastName
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
        onRemove();
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

  if (!canBeRendered) {
    return <AuthLoading />;
  }

  return <div className="w-full">
    <Fieldset className="space-y-6 p-4 py-2">
      <Field>
        <LoginSelector login={user?.login} />
      </Field>
      <Field>
        {/* <Description className="text-sm/6 text-white/50">
          Имя пользователя
        </Description> */}
      <Label className="text-sm/6 font-medium text-white">Имя</Label>
        <Input
          type="text"
          onChange={e => setFirstName(e.target.value ?? "")}
          value={firstName}
          className={clsx(
            'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        />
      </Field>
      <Field>
        {/* <Description className="text-sm/6 text-white/50">
          Фамилия пользователя
        </Description> */}
    <Label className="text-sm/6 font-medium text-white">Фамилия</Label>
        <Input
          type="text"
          onChange={e => setLastName(e.target.value ?? "")}
          value={lastName}
          className={clsx(
            'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        />
      </Field>
      <Field>
        <RoleSelector role={selectedRole} setRole={setSelectedRole} />
      </Field>
      <div>
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
      <div>
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
      successMessage="Пользователь обновлен"
    />
  </div>;
};
