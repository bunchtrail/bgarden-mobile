import { useEffect, useRef } from 'react';

/**
 * Тип для свойств компонента
 */
type Props = Record<string, unknown>;

/**
 * Хук для отслеживания, какие пропсы вызывают перерендер компонента
 * 
 * @param componentName Имя компонента для логирования
 * @param props Пропсы компонента
 */
export function useWhyDidYouUpdate(componentName: string, props: Props): void {
  // Сохраняем предыдущие пропсы
  const prevProps = useRef<Props>({});
  
  useEffect(() => {
    if (prevProps.current) {
      // Находим изменившиеся пропсы
      const changedProps = Object.entries(props).reduce((changed, [key, value]) => {
        // Сравниваем с предыдущим значением
        if (prevProps.current[key] !== value) {
          changed[key] = { 
            from: prevProps.current[key], 
            to: value 
          };
        }
        return changed;
      }, {} as Record<string, { from: unknown, to: unknown }>);
      
      // Если есть изменения, логируем их
      if (Object.keys(changedProps).length > 0) {
        console.log(`[${componentName}] Изменились пропсы:`, changedProps);
      }
    }
    
    // Обновляем предыдущие пропсы
    prevProps.current = props;
  });
}

/**
 * Хук для отслеживания перерендеров компонента
 * 
 * @param componentName Имя компонента для логирования
 * @param dependencies Зависимости для отслеживания перерендеров
 */
export function useRenderTracker(componentName: string, dependencies?: React.DependencyList): void {
  // Счетчик рендеров
  const renderCount = useRef(0);
  
  // Используем для отслеживания монтирования/размонтирования
  useEffect(() => {
    console.log(`[${componentName}] Компонент смонтирован`);
    return () => {
      console.log(`[${componentName}] Компонент размонтирован (всего рендеров: ${renderCount.current})`);
    };
  }, [componentName]);
  
  // Логируем каждый рендер
  renderCount.current += 1;
  console.log(`[${componentName}] Рендер #${renderCount.current}`);
  
  // Создаем рефы вне условия
  const depsRef = useRef<React.DependencyList | null>(null);
  
  // Всегда запускаем useEffect, но проверяем dependencies внутри
  useEffect(() => {
    if (!dependencies) return;
    
    if (depsRef.current && depsRef.current.length > 0) {
      const changedDeps = dependencies.map((dep, i) => {
        if (depsRef.current && depsRef.current[i] !== dep) {
          return { 
            index: i, 
            from: depsRef.current[i], 
            to: dep 
          };
        }
        return null;
      }).filter(Boolean);
      
      if (changedDeps.length > 0) {
        console.log(`[${componentName}] Изменились зависимости:`, changedDeps);
      }
    }
    
    depsRef.current = [...dependencies];
  }, dependencies || []);
}

/**
 * Хук для измерения времени рендеринга компонента
 * 
 * @param componentName Имя компонента для логирования
 */
export function useRenderTimer(componentName: string): void {
  const startTime = useRef(performance.now());
  
  // Логируем время рендеринга
  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    console.log(`[${componentName}] Рендеринг занял ${duration.toFixed(2)}ms`);
    
    // Сбрасываем таймер для следующего рендера
    startTime.current = performance.now();
  });
}

/**
 * Заменитель для JSON.stringify для лучшего логирования компонентов
 * Не включает функции и циклические ссылки
 */
export function replacer(key: string, value: unknown): unknown {
  if (typeof value === 'function') {
    return '[Function]';
  }
  if (typeof value === 'symbol') {
    return value.toString();
  }
  return value;
}

/**
 * Логирует объект с пропсами или состоянием
 * 
 * @param componentName Имя компонента для логирования
 * @param label Метка для объекта (например, "Props" или "State")
 * @param obj Объект для логирования
 */
export function logObject(componentName: string, label: string, obj: Props): void {
  console.log(`[${componentName}] ${label}:`, JSON.stringify(obj, replacer));
} 