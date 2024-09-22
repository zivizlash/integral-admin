"use client";

import _ from "lodash";
import { useEffect, useState } from "react";
import axios from "@/logic/api/api";
import { ADMIN_GETUSERS, CATEGORIES_GET, CHANGES_QUERY, THINGS_GET } from "@/logic/api/endpoints";
import { EntityChangeItem, EntityChangeType, EntityChangeTypeDto, User } from "@/logic/models/definition";
import { ChevronDownIcon, ClockIcon, ListBulletIcon, TagIcon, TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import clsx from "clsx";

type IdToName = { [k: string]: string };

const formatChangeType = (changeType: number, oldValue: string, newValue: string) => {
  switch (changeType) {
    case 1:
      return `Добавлен элемент ${newValue}`;
    case 2:
      return `Удален элемент ${oldValue}`;
    case 0:
    default:
      return `Изменено с ${oldValue} на ${newValue}`;
  }
};

const formatPropertyName = (propertyName: string) => {
  switch (propertyName) {
    case "name":
      return "Наименование";
    case "position":
      return "Позиция";
    case "rotation":
      return "Поворот";
    case "parentId":
      return "Родительский объект";
    case "categories":
      return "Категории";
    case "instanceId":
      return "Трехмерная модель"
    case "scale":
      return "Масштаб";
    case "color1":
      return "Цвет объекта 1";
    case "color2":
      return "Цвет объекта 2";
    case "categoryValueType":
      return "Тип категории";
    case "relations":
      return "Дочерние категории";

    default: return propertyName;
  };
};

const formatEntityType = (entityType: string) => {
  switch (entityType) {
    case "Thing":
      return "Объект";
    case "Category":
      return "Категория";
    default:
      return entityType;
  }
};

export default function Page() {
  const [changes, setChanges] = useState<EntityChangeTypeDto[]>();
  const [users, setUsers] = useState<User[]>();
  const [things, setThings] = useState<IdToName>();
  const [categories, setCategories] = useState<IdToName>();

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);

    axios.get(CATEGORIES_GET)
      .then((res) => {
        const categories = res.data.value.map(
          (c: { id: number, name: string }) => [c.id, c.name]);

        setCategories(Object.fromEntries(categories));
      });

    axios.get(THINGS_GET)
      .then((res) => {
        const things = res.data.value.map(
          (c: { id: number, name: string }) => [c.id, c.name]);

        setThings(Object.fromEntries(things));
      });

    axios.get(CHANGES_QUERY(d))
      .then(res => {
        const newChanges = res.data.value.map((c: EntityChangeType): EntityChangeType => {
          return {
            entityType: c.entityType,
            change: {
              ...c.change,
              createdAt: new Date(c.change.createdAt)
            }
          };
        });
        setChanges(newChanges);
      });

    axios.get(ADMIN_GETUSERS)
      .then((res) => {
        setUsers(res.data.value);
      });
  }, []);

  const getName = (change: EntityChangeTypeDto) => {
    switch (change.entityType) {
      case "Thing":
        return things?.[change.change.entityId];
      case "Category":
        return categories?.[change.change.entityId];
      default:
        return null;
    }
  }

  const canRender = changes != null
    && users != null && things != null
    && categories != null;

  const idToUser = users != null
    ? Object.fromEntries(users.map(u => [u.id.toString(), u]))
    : null;

  const formatChangeValue = (changeValue: string, output: boolean) => {
    if (changeValue == null || changeValue == "") {
      return <span className="italic text-rose-700/90"> Пусто </span>;
    }

    return <span className={output ? "text-green-700/90" : "text-rose-700/90"}> {changeValue} </span>;
  }

  const groupAndFormatComplexChanges = (changeInfo: EntityChangeTypeDto) => {
    const [categoriesChanges, otherChanges] = _.partition(
      changeInfo.change.changes, c => c.type == 9);

    const processed = categoriesChanges.map(c => {
      const parsed = JSON.parse(c.newValue || c.oldValue);
      const categoryId: number = parsed.categoryId;
      const value: string = parsed.value;
      const isAdded = c.operation === 1;
      return { categoryId, value, isNewValue: isAdded };
    });

    const categoriesChange = Object.entries(
      _.groupBy(processed, c => c.categoryId)).map(
        ([categoryId, categories]) => {
          const [oldChange, newChange] = [
            categories.find(c => !c.isNewValue),
            categories.find(c => c.isNewValue)
          ];

          return {
            categoryId,
            oldValue: oldChange!.value,
            newValue: newChange!.value
          };
        }
      );

    const elements = categoriesChange.map(change => {
      return (<div key={`categories-${change.categoryId}${change.oldValue}${change.newValue}`}>
        <span className="text-white/80">
          Значение категории 
          <span className="text-white"> {(categories![change.categoryId])} </span>
          изменено с {formatChangeValue(change.oldValue, false)} на
          {formatChangeValue(change.newValue, true)}
        </span>
      </div>);
    });

    return elements.concat(otherChanges.map(formatChange));
  };

  const formatChange = (change: EntityChangeItem) => {
    switch (change.operation) {
      case 1: // added
        return (<div key={`${change.property}${change.oldValue}${change.newValue}`}>
          <span className="text-white/80">
            {formatPropertyName(change.property)} добавлено значение
          </span> {formatChangeValue(change.newValue, true)}
        </div>);
      case 2: // removed
        return (<div key={`${change.property}${change.oldValue}${change.newValue}`}>
          <span className="text-white/80">
            {formatPropertyName(change.property)} удалено значение
          </span> {formatChangeValue(change.oldValue, false)}
        </div>);
      default: // static 
        return (<div key={`${change.property}${change.oldValue}${change.newValue}`}>
          <span className="text-white/80">
            {formatPropertyName(change.property)}
          </span> с {formatChangeValue(change.oldValue, false)} на {formatChangeValue(change.newValue, true)}
        </div>);
    }
  };

  return (<div className="flex w-full h-full justify-between">
    <div className="w-full p-4">
      {!canRender
        ? (<h1>Загрузка...</h1>)
        : <div>
          <h1 className="p-4">Изменения в системе за последние 30 дней</h1>
          <ul>
            {changes!.map((changeInfo) => {
              const userId = changeInfo.change.createdById;
              let user: User | null = null;

              if (idToUser != null && userId != null) {
                user = idToUser[userId.toString()] ?? null;
              }

              const changeName = getName(changeInfo);

              return (
                <li className="w-full rounded-xl
                text-sm/6 transition hover:bg-white/5"
                  key={`${changeInfo.entityType}${changeInfo.change.id}`}>
                  <Disclosure as="div" className="p-4 w-full" defaultOpen={false}>
                    <DisclosureButton className="group flex w-full items-center justify-between">
                      <div className="w-full text-left">
                        <span className={clsx(
                          "text-sm/6 font-medium",
                          (changeName ?? "").trim() != "" && "text-white group-data-[hover]:text-white/80",
                          (changeName ?? "").trim() == "" && "italic text-gray-500 group-data-[hover]:text-gray-500/80"
                        )}>
                          {(changeName == null || changeName.trim() == "")
                            ? "Название отсутствует" : changeName}
                        </span>
                        <div>
                          <ul className="flex gap-2 text-white/50 justify-between pr-4" aria-hidden="true">
                            <li title="Дата изменения">
                              <ClockIcon className="size-5 pr-1 mb-0.5 inline fill-white/60 group-data-[hover]:fill-white/50" />
                              {changeInfo.change.createdAt.toLocaleString("ru-RU").replaceAll(",", "")}
                            </li>
                            <li title="Логин пользователя совершившего изменения">
                              <UserIcon className="size-5 pr-1 mb-0.5 inline fill-white/60 group-data-[hover]:fill-white/50" />
                              {user?.login}
                            </li>
                            <li title="Изменяемый тип">
                              <TagIcon className="size-5 pr-1 mb-0.5 inline fill-white/60 group-data-[hover]:fill-white/50" />
                              {formatEntityType(changeInfo.entityType)}
                            </li>
                            <li title="Идентификатор изменяемой сущности">
                              <TicketIcon className="size-5 pr-1 mb-0.5 inline fill-white/60 group-data-[hover]:fill-white/50" />
                              {changeInfo.change.entityId}
                            </li>
                            <li title="Число изменений">
                              <ListBulletIcon className="size-5 pr-1 mb-0.5 inline fill-white/60 group-data-[hover]:fill-white/50" />
                              {changeInfo.change.changes.length}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                      <div className="">
                        {groupAndFormatComplexChanges(changeInfo)}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </li>)
            })
            }
          </ul>
        </div>
      }
    </div>
  </div>);
}
