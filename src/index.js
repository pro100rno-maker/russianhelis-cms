'use strict';

// Автоматически выдаём public-доступ к find / findOne для helicopter и post
module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    try {
      const neededActions = [
        'api::helicopter.helicopter.find',
        'api::helicopter.helicopter.findOne',
        'api::post.post.find',
        'api::post.post.findOne',
      ];

      // Ищем public-роль
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        strapi.log.warn('Public role not found, skip permissions bootstrap');
        return;
      }

      // Включаем нужные permissions
      await strapi.db
        .query('plugin::users-permissions.permission')
        .updateMany({
          where: {
            role: publicRole.id,
            action: { $in: neededActions },
          },
          data: {
            enabled: true,
          },
        });

      strapi.log.info('Public API permissions enabled for helicopter & post');
    } catch (e) {
      strapi.log.error('Failed to bootstrap public permissions', e);
    }
  },
};
