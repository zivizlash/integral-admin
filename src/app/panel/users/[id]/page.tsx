"use client";

import { PageTabGroup } from "@/app/components/page-tab-group";
import { UserEditor } from "@/app/components/user-editor";
import { UserPassword } from "@/app/components/user-password";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailed() {
  const router = useRouter();
  const params = useParams();
  const userId: number = +params.id;

  const pages = [
    {
      name: "Редактирование",
      component: <UserEditor userId={userId}
        onRemove={() => router.push("/users/panel")}
      />
    },
    {
      name: "Сброс пароля",
      component: <UserPassword userId={userId} />
    }
  ];

  return <PageTabGroup pages={pages} />;
}
