"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
class ProductoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/crearProducto', productoController_1.productoController.create);
        this.router.put('/actualizar/:id', productoController_1.productoController.update); //ya funciona
        this.router.delete('/eliminar/:id', productoController_1.productoController.delete);
        this.router.get('/', productoController_1.productoController.list);
        this.router.get('/:id', productoController_1.productoController.listOne);
        this.router.put('/aplicarDescuento/:id', productoController_1.productoController.aplicarDescuento);
        this.router.get('/filtrarProductos/:id', productoController_1.productoController.filtrarProductos);
    }
}
const productoRoutes = new ProductoRoutes();
exports.default = productoRoutes.router;
