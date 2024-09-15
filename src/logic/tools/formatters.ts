export const formatRole = (role: number) => {
  switch (role) {
    case 0:
      return "Доступ на чтение";
    case 1:
      return "Доступ на изменение"
    case 2:
      return "Администратор";
  }
}

export const formatDate = (dt: Date) => {
  return dt.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).split(' ')
    .map(v => v.replaceAll('.', ''))
    .join(' ')
    .replace(' г', '');
}

export const formatNumeric = (dt: Date) => {
  return dt.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).split(' ')
    .join('.')
    .replace(' г', '');
};
