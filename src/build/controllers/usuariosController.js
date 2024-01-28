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
exports.usuariosController = void 0;
const database_1 = __importDefault(require("../database"));
class UsuariosController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, password } = req.params;
            console.log(correo);
            console.log(password);
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios WHERE correo = ? AND password = ?', [correo, password]);
            if (respuesta.length > 0) {
                res.json(true);
                return;
            }
            res.json(false);
            //res.status(404).json({'mensaje': 'Usuario no encontrado'});
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Usuario no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO usuarios set ?", [req.body]);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(req.params);
            //console.log(id)
            const resp = yield database_1.default.query("UPDATE usuarios set ? WHERE idUsuario = ?", [req.body, id]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("DELETE FROM usuarios WHERE idUsuario =?", [id]);
            res.json(resp);
        });
    }
    verPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const respuesta = yield database_1.default.query("SELECT pe.idPedido,pro.idProducto,pe.cantidadProducto,pe.subtotal FROM pedido pe JOIN compra co on pe.idCompra=co.idCompra join producto pro on pro.idProducto= pe.idProducto join usuarios usr ON usr.idUsuario=co.idCliente WHERE usr.idUsuario=?", [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'El usuario no tiene pedidos' });
        });
    }
    rastrearPedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const respuesta = yield database_1.default.query("SELECT pe.idPedido,pro.idProducto,pe.cantidadProducto,pe.subtotal FROM pedido pe JOIN compra co on pe.idCompra=co.idCompra join producto pro on pro.idProducto= pe.idProducto join usuarios usr ON usr.idUsuario=co.idCliente WHERE pe.idPedido=?", [id]);
            if (respuesta.length > 0 && respuesta[0].idPedido == id) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Este pedido no existe' });
        });
    }
    recomendaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query("SELECT pro.idProducto, SUM(pe.cantidadProducto) AS totalComprado FROM producto pro JOIN pedido pe ON pe.idProducto = pro.idProducto JOIN compra co ON co.idCompra = pe.idCompra WHERE co.idCliente = ? GROUP BY pro.idProducto ORDER BY totalComprado DESC LIMIT 5", [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            else {
                //console.log("entro");
                const respuesta = yield database_1.default.query("SELECT * FROM producto ORDER BY RAND() LIMIT 5");
                res.json(respuesta);
                return;
            }
        });
    }
    buscarUsuarioporAtributo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { valor } = req.body;
            const respuesta = yield database_1.default.query("SELECT * FROM usuarios WHERE nombre like" + "'%" + valor + "%'");
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(404).json({ 'mensaje': 'No se encontraron usuarios con ese atributo' });
        });
    }
}
exports.usuariosController = new UsuariosController();
