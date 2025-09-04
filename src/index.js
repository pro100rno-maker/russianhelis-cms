'use strict';

// Надёжно включаем Public-доступ к find/findOne для helicopter и post
module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    const actions = [
      'api::helicopter.helicopter.find',
      'api::helicopter.helicopter.findOne',
      'api::post.post.find',
      'api::post.post.findOne',
    ];

    try {
      // Ищем Public-роль
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        strapi.log.warn('Public role not found; skip permissions bootstrap');
        return;
      }

      // Хелпер: включить одно действие
      const enable = async (action) => {
        const Permission = strapi.db.query('plugin::users-permissions.permission');

        const existing = await Permission.findOne({
          where: { action, role: publicRole.id },
        });

        if (existing) {
          if (!existing.enabled) {
            await Permission.update({
              where: { id: existing.id },
              data: { enabled: true },
            });
          }
          return;
        }

        // Создаём, если не существует
        await Permission.create({
          data: {
            action,
            role: publicRole.id,
            enabled: true,
            policy: '',
            conditions: [],
          },
        });
      };

      for (const a of actions) {
        // Последовательно, чтобы не споткнуться об транзакции
        /* eslint-disable no-await-in-loop */
        await enable(a);
      }

      strapi.log.info('✅ Public API permissions enabled for helicopter & post');
    } catch (e) {
      strapi.log.error('❌ Failed to bootstrap public permissions', e);
    }
  },
};
