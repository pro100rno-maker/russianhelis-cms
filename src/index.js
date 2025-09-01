'use strict';

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    try {
      // 1) Включим публичные права на чтение каталога (безопасно повторяем)
      try {
        const publicRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: 'public' } });

        if (publicRole) {
          const perms = publicRole.permissions || {};
          perms['api::helicopter.helicopter'] = {
            controllers: { helicopter: { find: { enabled: true }, findOne: { enabled: true } } },
          };
          await strapi.query('plugin::users-permissions.role').update({
            where: { id: publicRole.id },
            data: { permissions: perms },
          });
        }
      } catch (e) {
        strapi.log.warn('Public permissions not set automatically. Configure in Settings → Roles.');
      }

      // 2) i18n: убедимся, что ru/en существуют (если плагин подключён)
      try {
        const localesService = strapi.plugin('i18n')?.service('locales');
        if (localesService) {
          const list = await localesService.find();
          const hasRu = list.some(l => l.code === 'ru');
          const hasEn = list.some(l => l.code === 'en');
          if (!hasRu) await localesService.create({ code: 'ru', name: 'Russian' });
          if (!hasEn) await localesService.create({ code: 'en', name: 'English' });
          // Не меняем defaultLocale здесь, пусть остаётся как в настройках
        }
      } catch (e) {
        strapi.log.warn('i18n locales check/create skipped:', e.message);
      }

      // 3) Сидер: создаём тестовый вертолёт ТОЛЬКО если коллекция пуста
      const count = await strapi.entityService.count('api::helicopter.helicopter');
      if (count === 0) {
        await strapi.entityService.create('api::helicopter.helicopter', {
          data: {
            name: 'Ми-8МТВ-1',
            year: 1991,
            price: 3500000,
            location: 'RU',
            apu: 'АИ-9В (183 ч, 3336 запусков, 1656 ч суммарно)',
            engines: [
              { __component: 'engine.engine', model: 'ТВ3-117ВМ', hours: 1698 },
              { __component: 'engine.engine', model: 'ТВ3-117ВМ', hours: 2693 },
            ],
            components: [
              { __component: 'unit.unit-hours', name: 'Планер', hours: 2403 },
              { __component: 'unit.unit-hours', name: 'Главный редуктор ВР-14', hours: 2403 },
            ],
            description: 'После ремонта. Готов к эксплуатации. Тестовая карточка.',
            publishedAt: new Date(),
            // ВАЖНО: НЕ указывать locale — Strapi проставит локаль по умолчанию
          },
        });
        strapi.log.info('Seeded 1 helicopter.');
      }
    } catch (err) {
      strapi.log.error('Bootstrap failed:', err);
    }
  },
};
