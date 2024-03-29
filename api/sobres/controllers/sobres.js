'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.sobres.search(ctx.query);
    } else {
      entities = await strapi.services.sobres.find(ctx.query);
    }


    entities.forEach(sobre => {
      if(sobre.pagos && sobre.pagos.length > 0) { // Si existen pagos registrados
        console.log(sobre.pagos);
        let fechaPagado = new Date(sobre.pagos[sobre.pagos.length - 1].fecha);
        let fechaActual = new Date();
        sobre.pagado = fechaPagado.getMonth() === fechaActual.getMonth();
      }else{
        sobre.pagado = false;
      }
    });

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.sobres }));
  },
};
