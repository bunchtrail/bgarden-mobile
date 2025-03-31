/**
 * Скрипт настройки туннеля для удаленного доступа к приложению
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Путь к app.json
const appJsonPath = path.resolve(__dirname, '..', 'app.json');

// Функция для сохранения публичного URL API
async function setupTunnelConfig() {
  try {
    console.log('🌐 Настройка доступа через туннель');
    console.log('─────────────────────────────────');
    
    // Чтение app.json
    const appJsonContent = fs.readFileSync(appJsonPath, 'utf-8');
    const appJson = JSON.parse(appJsonContent);
    
    // Предупреждение о необходимости правильно настроить back-end
    console.log('⚠️  Для работы приложения через туннель вам необходимо:');
    console.log('1. Убедиться, что ваш API доступен через публичный URL');
    console.log('2. Указать этот URL в services/api.ts');
    console.log('');
    
    // Запрос URL
    rl.question('Введите публичный URL для вашего API (или нажмите Enter, чтобы пропустить): ', (apiUrl) => {
      if (apiUrl) {
        // Обновляем файл api.ts с публичным URL
        const apiFilePath = path.resolve(__dirname, '..', 'services', 'api.ts');
        
        if (fs.existsSync(apiFilePath)) {
          let apiContent = fs.readFileSync(apiFilePath, 'utf-8');
          
          // Заменяем URL в файле
          apiContent = apiContent.replace(
            /['"]https:\/\/your-api-public-url\.com['"]/, 
            `'${apiUrl}'`
          );
          
          fs.writeFileSync(apiFilePath, apiContent);
          console.log(`✅ URL API обновлен: ${apiUrl}`);
        }
      }
      
      // Устанавливаем режим туннеля в app.json
      if (!appJson.expo.extra) {
        appJson.expo.extra = {};
      }
      
      appJson.expo.extra.host = 'tunnel';
      
      // Сохраняем обновленный app.json
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
      
      console.log('✅ Режим туннеля активирован в app.json');
      console.log('');
      console.log('🚀 Теперь запустите приложение командой: npm run start:tunnel');
      
      rl.close();
    });
  } catch (error) {
    console.error('❌ Ошибка настройки туннеля:', error);
    rl.close();
  }
}

// Запуск скрипта
setupTunnelConfig(); 