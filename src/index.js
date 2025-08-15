'use strict';

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (publicRole) {
        const perms = publicRole.permissions || {};
        perms['api::helicopter.helicopter'] = {
          controllers: { helicopter: { find: { enabled: true }, findOne: { enabled: true } } }
        };
        await strapi.query('plugin::users-permissions.role').update({
          where: { id: publicRole.id },
          data: { permissions: perms },
        });
      }
    } catch (e) {
      strapi.log.warn('Public permissions not set automatically. Configure in Settings → Roles.');
    }

    const count = await strapi.entityService.count('api::helicopter.helicopter');
    if (count === 0) {
      await strapi.entityService.create('api::helicopter.helicopter', {
        data: {
          name: 'Ми‑8МТВ‑1',
          year: 1991,
          price: 3500000,
          location: 'RU',
          apu: 'АИ‑9В (183 ч, 3336 запусков, 1656 ч суммарно)',
          engines: [
            { __component: 'engine.engine', model: 'ТВ3‑117ВМ', hours: 1698 },
            { __component: 'engine.engine', model: 'ТВ3‑117ВМ', hours: 2693 }
          ],
          components: [
            { __component: 'unit.unit-hours', name: 'Планер', hours: 2403 },
            { __component: 'unit.unit-hours', name: 'Главный редуктор ВР‑14', hours: 2403 }
          ],
          description: 'После ремонта. Готов к эксплуатации. Тестовая карточка.',
          locale: 'ru',
          publishedAt: new Date()
        }
      });
      strapi.log.info('Seeded 1 helicopter.');
    }
  },
};
