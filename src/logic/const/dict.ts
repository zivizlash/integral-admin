export const propertyNames = [
  { key: "name", value: "Наименование" },
  { key: "position", value: "Позиция" },
  { key: "rotation", value: "Поворот" },
  { key: "parentId", value: "Родительский объект" },
  { key: "categories", value: "Категории" },
  { key: "instanceId", value: "Трехмерная модель" },
  { key: "scale", value: "Масштаб" },
  { key: "color1", value: "Цвет объекта 1" },
  { key: "color2", value: "Цвет объекта 2" },
  { key: "categoryValueType", value: "Тип категории" },
  { key: "relations", value: "Дочерние категории" }
];

export const getPropName = (name: string) => {
  return propertyNames.find(pn => pn.key == name)?.value ?? name;
};

export const propertyTypes = [
  { key: "Thing", value: "Объект" },
  { key: "Category", value: "Категория" }
];

export const getPropType = (name: string) => {
  return propertyTypes.find(pt => pt.key == name)?.value ?? name;
};
