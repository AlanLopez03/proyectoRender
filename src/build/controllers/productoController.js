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
exports.productoController = void 0;
const database_1 = __importDefault(require("../database"));
class ProductoController {
    verOfertas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield database_1.default.query('SELECT * FROM producto WHERE descuento<1');
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.json(false);
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //const respuesta = await pool.query('SELECT * FROM producto');
                const respuesta = yield database_1.default.query('SELECT idProducto, nombre, descripcion,stock,precio,descuento,DATE(inicio_descuento),Date(fin_descuento),idMaterial,idCategoria,idMarca  FROM producto');
                res.json(respuesta);
            }
            catch (_a) {
                res.json(false);
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM producto WHERE idProducto = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.json(false);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield database_1.default.query("INSERT INTO producto set ?", [req.body]);
                res.json(resp);
            }
            catch (_a) {
                res.json(false);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(req.params);
            //console.log(id)
            const resp = yield database_1.default.query("UPDATE producto set ? WHERE idProducto = ?", [req.body, id]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("DELETE FROM producto WHERE idProducto =?", [id]);
            res.json(resp);
        });
    }
    aplicarDescuento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { descuento } = req.body;
            console.log(descuento);
            try {
                const resp = yield database_1.default.query("UPDATE producto set descuento=? WHERE idProducto = ?", [descuento, id]);
                res.json(resp);
            }
            catch (err) {
                console.log(err);
                res.json(false);
            }
        });
    }
    filtrarProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const respuesta = yield database_1.default.query('SELECT * FROM producto WHERE idCategoria = ?', [id]);
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.json(false);
            }
            catch (err) {
                console.log(err);
                res.json(false);
            }
        });
    }
    buscarporNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.body;
            const respuesta = yield database_1.default.query('SELECT * FROM producto WHERE nombre LIKE ?', [`%${nombre}%`]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json(false);
        });
    }
    agregarStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { stock } = req.body;
            try {
                const respuesta = yield database_1.default.query('UPDATE producto set stock=stock+? WHERE idProducto = ?', [stock, id]);
                res.json(respuesta);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    buscarbyCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoria = req.params.id;
            //console.log(categoria);
            try {
                const consulta = yield database_1.default.query('SELECT producto.idProducto, producto.nombre, producto.descripcion,producto.stock,producto.precio,producto.descuento,DATE(inicio_descuento),Date(fin_descuento),producto.idMaterial,producto.idCategoria,producto.idMarca FROM producto where producto.idCategoria = ?', [categoria]);
                res.json(consulta);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.productoController = new ProductoController();
