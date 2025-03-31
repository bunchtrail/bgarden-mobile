/**
 * Утилита для анализа перерендеров React компонентов
 * 
 * Это вспомогательный скрипт для обнаружения лишних перерендеров в приложении.
 * Использование:
 * 
 * 1. Вставьте следующий код в начало компонента для отслеживания:
 *    console.log(`[${componentName}] Рендеринг`);
 * 
 * 2. Добавьте логирование пропсов и состояния:
 *    console.log(`[${componentName}] Props:`, JSON.stringify(props, replacer));
 *    console.log(`[${componentName}] State:`, JSON.stringify(state, replacer));
 * 
 * 3. Используйте useWhyDidYouUpdate хук для отслеживания изменений пропсов
 */

/**
 * Заменитель для JSON.stringify для лучшего логирования компонентов
 * Не включает функции и циклические ссылки
 */
function replacer(key, value) {
  if (typeof value === 'function') {
    return '[Function]';
  }
  if (typeof value === 'symbol') {
    return value.toString();
  }
  return value;
}

/**
 * Хук для отслеживания, какие пропсы вызывают перерендер компонента
 * 
 * Пример использования:
 * ```
 * function MyComponent(props) {
 *   useWhyDidYouUpdate('MyComponent', props);
 *   // ...
 * }
 * ```
 */
/*
import { useEffect, useRef } from 'react';

export function useWhyDidYouUpdate(componentName, props) {
  // Сохраняем предыдущие пропсы
  const prevProps = useRef({});
  
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
      }, {});
      
      // Если есть изменения, логируем их
      if (Object.keys(changedProps).length > 0) {
        console.log(`[${componentName}] Изменились пропсы:`, changedProps);
      }
    }
    
    // Обновляем предыдущие пропсы
    prevProps.current = props;
  });
}
*/

/**
 * Добавить этот код в компонент для трекинга жизненного цикла
 * 
 * useEffect(() => {
 *   console.log(`[${componentName}] Компонент смонтирован`);
 *   return () => {
 *     console.log(`[${componentName}] Компонент размонтирован`);
 *   };
 * }, []);
 */

/**
 * Инструкции по профилированию компонентов
 * 
 * 1. Импортируйте Profiler из React:
 *    import { Profiler } from 'react';
 * 
 * 2. Оберните компонент в Profiler:
 *    <Profiler id="ComponentName" onRender={onRenderCallback}>
 *      <YourComponent />
 *    </Profiler>
 * 
 * 3. Определите функцию обратного вызова:
 *    function onRenderCallback(
 *      id, // id профилера, чтобы отличать компоненты
 *      phase, // "mount" (монтирование) или "update" (обновление)
 *      actualDuration, // время, затраченное на рендеринг
 *      baseDuration, // оценочное время для полного рендера
 *      startTime, // когда React начал рендерить
 *      commitTime, // когда React зафиксировал обновление
 *      interactions // Set взаимодействий, которые привели к обновлению
 *    ) {
 *      console.log(`[${id}] Рендеринг занял ${actualDuration.toFixed(2)}ms (${phase})`);
 *    }
 */

// Готовая функция обратного вызова для профилирования
function logRenderPerformance(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log(
    `[${id}] Рендеринг: ${phase}, ` +
    `время: ${actualDuration.toFixed(2)}ms, ` +
    `базовое время: ${baseDuration.toFixed(2)}ms, ` +
    `commit: ${new Date(commitTime).toISOString()}`
  );
}

module.exports = {
  replacer,
  logRenderPerformance,
  // Раскомментируйте и импортируйте в коде, когда потребуется
  // useWhyDidYouUpdate
}; 