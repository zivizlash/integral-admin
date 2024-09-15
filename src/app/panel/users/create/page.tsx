"use client";

import { axiosInstance } from "@/logic/api/api";
import { ADMIN_CREATEUSER, ADMIN_GETUSER } from "@/logic/api/endpoints";
import { Field, Label, Description, Input, Button, Fieldset, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UpdateStatus = "none" | "progress" | "success" | "fail";

export default function UserCreate() {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("none");
  const router = useRouter();

  const createUser = () => {
    setUpdateStatus("progress");

    axiosInstance
      .post(ADMIN_CREATEUSER, {
        login: login,
        password: password,
        role: 0
      })
      .then(res => {
        setPassword("");
        setLogin("");
        const id = res.data.value.id;
        router.push(`/panel/users/${id}`);
      });
  };

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full p-4 max-w-2xl">
        <TabGroup>
          <TabList className="flex gap-4">
            <Tab
              key={"Создание пользователя"}
              className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white 
                      focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 
                      data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 
                      data-[focus]:outline-white"
            >
              Создание пользователя
            </Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel key={"1"} className="rounded-xl bg-white/5 p-3">
              <ul>
                <Fieldset className="space-y-6 p-4">
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">Пользователь</Label>
                    <Description className="text-sm/6 text-white/50">
                      По нему будет осуществляться вход. Минимум 1 символ
                    </Description>
                    <Input
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className={clsx(
                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                    />
                  </Field>
                  <Field>
                    <Label className="text-sm/6 font-medium text-white">Пароль</Label>
                    <Description className="text-sm/6 text-white/50">
                      Должен состоять как минимум из 6-ти символов
                    </Description>
                    <Input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={clsx(
                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                    />
                  </Field>
                  <Button onClick={createUser} className={clsx(
                    'text-center block w-full rounded-lg border-2 border-zinc-700 hover:border-zinc-600 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                    'mt-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                  )} disabled={updateStatus !== "none"}>
                    Создать
                  </Button>
                </Fieldset>
              </ul>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
