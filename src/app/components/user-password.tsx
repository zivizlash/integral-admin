import { axiosInstance } from "@/logic/api/api";
import { ADMIN_RESET_PASSWORD } from "@/logic/api/endpoints";
import { UpdateStatus } from "@/logic/models/definition";
import { Button, Description, Field, Fieldset, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { UpdateDialog } from "./update-dialog";

type InputResult = { value: string, isValid: boolean };

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return { isValid: false, message: "Должен состоять как минимум из 6-ти символов" };
  }

  return { isValid: true, message: "Пароль удовлетворяет условиям" };
};

export const PasswordInput = ({ title, onChange }: Readonly<{
  title: string,
  onChange: (input: InputResult) => void
}>) => {
  const [password, setPassword] = useState("");
  const { isValid, message } = validatePassword(password);

  useEffect(() => {
    onChange({ value: password, isValid });
  }, [password]);

  return <Field>
    <Label className="text-sm/6 font-medium text-white">
      {title}
    </Label>
    <Description className="text-sm/6 text-white/50">
      {message}
    </Description>
    <Input
      autoFocus
      value={password}
      onChange={e => setPassword(e.target.value)}
      placeholder="Пароль"
      className={clsx({
        "mt-1 block w-full transition rounded-lg -outline-offset-2 outline-none outline-2 bg-white/5 py-1.5 px-3 text-sm/6 text-white": true,
        "outline-green-500/50": isValid,
        "outline-red-500/50": !isValid
      })}
    />
  </Field>;
};

export const UserPassword = ({ userId }: Readonly<{
  userId: number
}>) => {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("none");

  const updatePassword = () => {
    if (isValid) {
      setUpdateStatus("progress");

      axiosInstance.put(ADMIN_RESET_PASSWORD, { userId, password })
        .then(() => {
          setUpdateStatus("success");
        });
    }
  };

  return <div className="w-full">
    <Fieldset className="space-y-6 p-4 py-2">
      <Field>
        <PasswordInput
          title="Новый пароль"
          onChange={({ isValid, value }) => { setIsValid(isValid); setPassword(value); }}
        />
      </Field>
      <Button onClick={updatePassword} className={clsx({
        "text-center block w-full rounded-lg border-2 border-rose-950 hover:bg-rose-900": true,
        "hover:border-rose-900 hover:bg-white/5 py-1.5 px-3 text-sm/6 text-white": true,
        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2": true,
        "data-[focus]:outline-white/25": true
      })}>
        Обновить пароль
      </Button>
    </Fieldset>
    <UpdateDialog
      updateStatus={updateStatus}
      close={close}
      successMessage="Пользователь обновлен"
    />
  </div>;
};
