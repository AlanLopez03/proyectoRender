"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compraController = void 0;
const database_1 = __importDefault(require("../database"));
class CompraController {
    Ventas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio } = req.body;
            const { fechaFin } = req.body;
            if (fechaInicio == null || fechaFin == null) {
                const respuesta = yield database_1.default.query('SELECT * FROM compra');
                res.json(respuesta);
            }
            else {
                const respuesta = yield database_1.default.query('SELECT * FROM compra where fecha between ? AND ?', [fechaInicio, fechaFin]);
                res.json(respuesta);
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM compra WHERE idCompra = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Compra no encontrada' });
        });
    }
    //public async create(req: Request, res: Response): Promise<void> {
    //const resp = await pool.query("INSERT INTO compra set ?",[req.body]);
    //res.json(resp);
    //}
    crearCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fecha } = req.body;
            const { idEdo } = req.body;
            console.log(id);
            console.log(fecha);
            console.log(idEdo);
            const productosVendidos = yield database_1.default.query("SELECT ca.idProducto, ca.cantidad FROM carrito ca WHERE ca.idCliente = ?", [id]);
            const busca = yield database_1.default.query("SELECT SUM(ca.cantidad * pro.precio * (pro.descuento)) AS total FROM carrito ca JOIN producto pro ON pro.idProducto = ca.idProducto WHERE ca.idCliente = ?", [id]);
            const total = busca[0].total;
            console.log(total);
            const compraData = {
                fecha: req.body.fecha,
                monto: total,
                idEdo: req.body.idEdo,
                idCliente: id
            };
            const respuesta = yield database_1.default.query("INSERT INTO compra set ? ", [compraData]);
            for (const producto of productosVendidos) {
                yield database_1.default.query("UPDATE producto SET stock = stock - ? WHERE idProducto = ?", [producto.cantidad, producto.idProducto]);
            }
            const limpiaCarrito = yield database_1.default.query("DELETE FROM carrito WHERE idCliente = ?", [id]);
            res.json(respuesta);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM compra');
            res.json(respuesta);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(req.params);
            //console.log(id)
            const resp = yield database_1.default.query("UPDATE compra set ? WHERE idCompra = ?", [req.body, id]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("DELETE FROM compra WHERE idCompra =?", [id]);
            res.json(resp);
        });
    }
    modificarEstadoCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { estado } = req.body;
            //console.log(id);
            //console.log(estado);
            const resp = yield database_1.default.query("UPDATE compra set idEdo = ? WHERE idCompra = ?", [estado, id]);
            res.json(resp);
        });
    }
    //Agre
    verMasVendidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio } = req.body;
            const { fechaFin } = req.body;
            if (fechaInicio == null || fechaFin == null) {
                const respuesta = yield database_1.default.query("SELECT idProducto,SUM(cantidadProducto) AS totalVendido FROM pedido GROUP BY idProducto ORDER BY totalVendido ASC LIMIT 10");
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos' });
            }
            else {
                console.log(fechaInicio);
                const respuesta = yield database_1.default.query("SELECT pe.idProducto,SUM(pe.cantidadProducto) AS totalVendido FROM pedido pe join compra co on co.idCompra=pe.idCompra where co.fecha between ? AND ? GROUP BY idProducto ORDER BY totalVendido ASC LIMIT 10", [fechaInicio, fechaFin]);
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos' });
            }
        });
    }
    verMenosVendidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio } = req.body;
            const { fechaFin } = req.body;
            if (fechaInicio == null || fechaFin == null) {
                const respuesta = yield database_1.default.query("SELECT idProducto,SUM(cantidadProducto) AS totalVendido FROM pedido GROUP BY idProducto ORDER BY totalVendido desc LIMIT 10");
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos' });
            }
            else {
                const respuesta = yield database_1.default.query("SELECT pe.idProducto,SUM(pe.cantidadProducto) AS totalVendido FROM pedido pe join compra co on co.idCompra=pe.idCompra where co.fecha between ? AND ? GROUP BY idProducto ORDER BY totalVendido desc LIMIT 10", [fechaInicio, fechaFin]);
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.status(404).json({ 'mensaje': 'No hay productos' });
            }
        });
    }
}
exports.compraController = new CompraController();
