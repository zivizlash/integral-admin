"use client";
import { userAtom } from "@/logic/api/atoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import axios from "@/logic/api/api";
import { CHANGES_QUERY } from "@/logic/api/endpoints";
import { EntityChangeType } from "@/logic/models/definition";

export default function Page() {
  const [user] = useAtom(userAtom);
  const [changes, setChanges] = useState<EntityChangeType[]>(null!);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);

    axios.get(CHANGES_QUERY(d))
      .then(res => {
        setChanges(res.data.value.map((c: EntityChangeType): EntityChangeType => {
          return {
            entityType: c.entityType,
            change: {
              ...c.change,
              createdAt: new Date(c.change.createdAt)
            }
          };
        }));
      });    
  }, []);

  return changes == null
    ? <h1>Hello, {user?.login}! Your role is {user?.role}</h1>
    : (
      <h1>To be continued...</h1>  
    );
}
