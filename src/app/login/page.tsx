"use client";

import clsx from 'clsx';
import Image from 'next/image';
import axios from "@/logic/api/api";
import { Field, Input, Button, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setStorageTokens } from "@/logic/state/tokenHelper";
import { useAtom } from 'jotai';
import { userAtom } from '@/logic/api/atoms';
import { USERS_TOKEN, USERS_CURRENT } from '@/logic/api/endpoints';
import { setStaticUser } from '@/logic/store/userStore';
import { JwtTokens } from '@/logic/models/definition';
import pic from "@/../public/Icon-Integral-256x.png";

export default function Page() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState<JwtTokens | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user != null && isUpdated) {
      router.push("/panel");
    }
  }, [isUpdated]);

  useEffect(() => {
    if (jwtToken == null) {
      return;
    }

    setStorageTokens(jwtToken.access, jwtToken.refresh);

    axios.get(USERS_CURRENT)
      .then(res => {
        const currentUser = res.data.value;
        setStaticUser(currentUser);
        setUser(currentUser);
        setIsUpdated(true);
      });
  }, [jwtToken]);

  const close = () => {
    setIsOpen(false);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    axios.post(USERS_TOKEN, { login, password })
      .then(res => {
        const { accessToken, refreshToken } = res.data.value;
        setJwtToken({
          access: accessToken,
          refresh: refreshToken
        });
      })
      .catch(err => {
        const status = err.response.status;

        if (status === 401 || status === 404) {
          console.log("неверные данные авторизации");
          setIsOpen(true);
          setPassword("");
        }
      });
  };

  return (
    <div>
      <div className="flex flex-col h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-md space-y-2 p-4">
          <div className='flex flex-col w-full items-center'>
            {/* <h2 className="text-2xl font-medium text-gray-300">
          Вход в панель управления
        </h2> */}
            <Image
              src={pic}
              width={640}
              height={751}

              priority
              alt="Integral logo"
            />
          </div>
        </div>
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-2 p-4 bg-white/5 rounded-xl">
          <Field>
            {/* <Label className="text-sm/6 font-medium text-white">Логин</Label> */}
            {/* <Description className="text-sm/6 text-white/50">Use your real name so people will recognize you.</Description> */}
            <Input autoFocus
              placeholder='Логин'
              value={login}
              name='login'
              onChange={(e) => setLogin(e.target.value)}
              className={clsx(
                'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
            />
          </Field>
          <Field className="">
            {/* <Label className="text-sm/6 font-medium text-white">Пароль</Label> */}
            {/* <Description className="text-sm/6 text-white/50">Use your real name so people will recognize you.</Description> */}
            <Input
              placeholder='Пароль'
              type="password"
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={clsx(
                'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
            />
          </Field>
          <Input
            type="submit"
            value='Войти'
            className={clsx(
              'block w-full rounded-lg border-2 border-gray-700 hover:border-gray-600 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
        </form>
      </div>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 z-10 w-screen">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              >
                <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                  Неверные данные авторизации
                </DialogTitle>
                <p className="mt-2 text-sm/6 text-white/50">
                  Пароль и/или логин неправильны.
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
}
