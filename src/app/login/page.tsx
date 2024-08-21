"use client";
import { Field, Input } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "@/logic/api/api";
import { setStorageTokens } from "@/logic/state/tokenHelper";
import { User } from '@/logic/models/definition';
import { useAtom } from 'jotai';
import { userAtom } from '@/logic/api/atoms';

export default function Page() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    axios.post("users/token", { login, password })
      .then(result => {
        const { accessToken, refreshToken } = result.data.value;
        setStorageTokens(accessToken, refreshToken);

        axios.get("users/current")
          .then(result => {
            const userResult = result.data.value;
            console.log("setted user", userResult);
            setUser(userResult);
          })
          .catch(err => {
            console.log("error while fetching user", err);
          });
      })
      .catch(err => {
        if (err.response.status == 401) {
          console.log("неверные данные авторизации");
          setPassword("");
        }
      });
  }
  
  useEffect(() => {
    console.log(`useEffect called; ${user != null}`);
    if (user != null) {
      router.push("/panel");
    }
  }, [setUser]);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-4">
    <div className="w-full max-w-md space-y-2 p-4">
      <div className='flex flex-col w-full items-center'>
        {/* <h2 className="text-2xl font-medium text-gray-300">
          Вход в панель управления
        </h2> */}
        <Image 
          src="/Icon-Integral-256x.png"
          width={448}
          height={448}
          alt="Integral logo" 
        />
      </div>
    </div>  
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-2 p-4 bg-white/5 rounded-xl">
      <Field>
        {/* <Label className="text-sm/6 font-medium text-white">Логин</Label> */}
        {/* <Description className="text-sm/6 text-white/50">Use your real name so people will recognize you.</Description> */}
        <Input
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
  )
}
