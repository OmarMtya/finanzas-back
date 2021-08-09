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

    let sobresLimpios = []; // Arreglo de sobres que no se han pagado este mes

    entities.forEach(sobre => {
      if(sobre.pagos && sobre.pagos.length > 0) { // Si existen pagos registrados
        let fechaPagado = new Date(sobre.pagos[sobre.pagos.length - 1].fecha);
        let fechaActual = new Date();
        if(fechaPagado.getMonth() !== fechaActual.getMonth()) { // Si el mes de la fecha de pago es diferente al mes actual
          sobresLimpios.push(sobre);
        }
      }else{
        sobresLimpios.push(sobre);
      }
    });

    return sobresLimpios.map(entity => sanitizeEntity(entity, { model: strapi.models.sobres }));
  },
};
