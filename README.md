# RussianHelis CMS (Strapi v4)

Готовая CMS для витрины вертолётов (RU/EN), с личным кабинетом и API.

## Быстрый старт локально
```bash
cp .env.example .env
npm i
npm run dev
# откройте админку: http://localhost:1337/admin
```
При первом заходе создайте учётку администратора.

## Деплой на Render
- New → Web Service → из GitHub
- Environment: Node 18
- Build: `npm install && npm run build`
- Start: `npm run start`
- Vars: APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET, PUBLIC_URL

## Структура
- Content Type: Helicopter (локализуемый)
- Components: engine.engine, unit.unit-hours
- i18n: ru / en
- Публичный доступ к find / findOne включается в bootstrap (src/index.js).

## Интеграция с сайтом (Next.js)
```ts
const API = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const res = await fetch(`${API}/api/helicopters?populate=*`);
const data = await res.json();
```
