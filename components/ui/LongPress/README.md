# LongPress компонент

Компонент, позволяющий обрабатывать долгие нажатия на любой элемент с отображением всплывающего меню действий.

## Особенности

- Обработка долгого нажатия на любом вложенном элементе
- Анимированное появление контекстного меню
- Автоматическое определение позиции меню (сверху или снизу элемента)
- Кастомизируемые действия с иконками
- Поддержка темы приложения
- Нейтральное обычное нажатие (pass-through)

## Использование

```tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LongPress } from '@/components/ui';

// В компоненте
const MyComponent = () => {
  // Действия для меню
  const actions = [
    {
      id: 'edit',
      label: 'Редактировать',
      icon: <Ionicons name="create-outline" size={20} color="blue" />,
      onPress: () => console.log('Редактировать')
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: <Ionicons name="trash-outline" size={20} color="red" />,
      onPress: () => console.log('Удалить')
    },
    {
      id: 'share',
      label: 'Поделиться',
      icon: <Ionicons name="share-outline" size={20} color="green" />,
      onPress: () => console.log('Поделиться')
    }
  ];

  return (
    <LongPress 
      actions={actions}
      onPress={() => console.log('Обычное нажатие')}
      longPressDuration={500}
      actionMenuPosition="auto"
    >
      <View style={{ padding: 20, backgroundColor: '#eee', borderRadius: 8 }}>
        <Text>Нажмите и удерживайте, чтобы открыть меню</Text>
      </View>
    </LongPress>
  );
};
```

## Пропсы

| Название           | Тип                             | По умолчанию | Описание                                           |
|--------------------|---------------------------------|--------------|---------------------------------------------------|
| children           | React.ReactNode                 | -            | Вложенные элементы, на которых работает нажатие    |
| actions            | ActionItem[]                    | -            | Массив действий для контекстного меню              |
| onPress            | () => void                      | undefined    | Обработчик обычного нажатия (опционально)          |
| longPressDuration  | number                          | 500          | Длительность долгого нажатия в миллисекундах       |
| actionMenuPosition | 'top' \| 'bottom' \| 'auto'     | 'auto'       | Позиция меню относительно элемента                 |

## Интерфейс ActionItem

```tsx
interface ActionItem {
  id: string;       // Уникальный идентификатор действия
  label: string;    // Текст действия
  icon?: React.ReactNode; // Опциональная иконка (например, из Ionicons)
  onPress: () => void; // Обработчик нажатия на действие
}
``` 