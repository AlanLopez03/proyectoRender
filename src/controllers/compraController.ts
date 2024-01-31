import {Request,Response} from 'express';
import pool from '../database';

class CompraController{
public async Ventas(req: Request, res: Response ): Promise<void>{
    const {fechaInicio} = req.body;
    const {fechaFin} = req.body;
    if (fechaInicio==null || fechaFin==null)

       { const respuesta = await pool.query('SELECT * FROM compra');
        res.json( respuesta );}
    else
    {
        const respuesta = await pool.query('SELECT * FROM compra where fecha between ? AND ?',[fechaInicio,fechaFin]);
        res.json( respuesta );
    }
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT * FROM compra WHERE idCompra = ?', [id]);
if(respuesta.length>0){
    res.json(respuesta[0]);
return ;
}
res.status(404).json({'mensaje': 'Compra no encontrada'});
}

//public async create(req: Request, res: Response): Promise<void> {
//const resp = await pool.query("INSERT INTO compra set ?",[req.body]);
//res.json(resp);
//}

public async crearCompra(req: Request, res: Response): Promise<void> 
{
    try
    {const {id} = req.params;
    const {fecha} = req.body;
    const {idEdo} = req.body;
    console.log(id);
    console.log(fecha);
    console.log(idEdo);
    const productosVendidos = await pool.query("SELECT ca.idProducto, ca.cantidad FROM carrito ca WHERE ca.idCliente = ?",[id]);
    const busca = await pool.query("SELECT SUM(ca.cantidad * pro.precio * (pro.descuento)) AS total FROM carrito ca JOIN producto pro ON pro.idProducto = ca.idProducto WHERE ca.idCliente = ?",[id]);
    const total =busca[0].total;
    console.log(total);
    const compraData = {
        fecha: req.body.fecha,
        monto: total,
        idEdo: req.body.idEdo,
        idCliente: id
    };
    const respuesta = await pool.query("INSERT INTO compra set ? ",[compraData]);
        for (const producto of productosVendidos) {
            await pool.query("UPDATE producto SET stock = stock - ? WHERE idProducto = ?",[producto.cantidad, producto.idProducto]);}
            
    const limpiaCarrito = await  pool.query("DELETE FROM carrito WHERE idCliente = ?",[id]);
    res.json(respuesta);
}
    catch(e){
        res.json(e);
     } 
   
}



public async list(req: Request, res: Response ): Promise<void>{
const respuesta = await pool.query('SELECT * FROM compra');
res.json( respuesta );
}



public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
console.log(req.params);
//console.log(id)
const resp = await pool.query("UPDATE compra set ? WHERE idCompra = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query("DELETE FROM compra WHERE idCompra =?",[id]);
res.json(resp);
}

public async modificarEstadoCompra(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {estado} = req.body;
    //console.log(id);
    //console.log(estado);
    const resp = await pool.query("UPDATE compra set idEdo = ? WHERE idCompra = ?", [estado,id]);
    res.json(resp);
    }

    //Agre

public async verMasVendidos(req: Request, res: Response): Promise <void>{
    const {fechaInicio} = req.body;
    const {fechaFin} = req.body;
    if(fechaInicio==null || fechaFin==null)
    {
        const respuesta = await pool.query("SELECT idProducto,SUM(cantidadProducto) AS totalVendido FROM pedido GROUP BY idProducto ORDER BY totalVendido ASC LIMIT 10");
        if(respuesta.length>0){
        res.json(respuesta);
        return ;
        }
        res.status(404).json({'mensaje': 'No hay productos'});
    }
    else
    {
        console.log(fechaInicio);
        const respuesta = await pool.query("SELECT pe.idProducto,SUM(pe.cantidadProducto) AS totalVendido FROM pedido pe join compra co on co.idCompra=pe.idCompra where co.fecha between ? AND ? GROUP BY idProducto ORDER BY totalVendido ASC LIMIT 10",[fechaInicio,fechaFin]);
        if(respuesta.length>0)
        {
        res.json(respuesta);
        return ;
        }
        res.status(404).json({'mensaje': 'No hay productos'});
    }
}

public async verMenosVendidos(req: Request, res: Response): Promise <void>{
    const {fechaInicio} = req.body;
    const {fechaFin} = req.body;
    if (fechaInicio==null || fechaFin==null)
    {
        const respuesta = await pool.query("SELECT idProducto,SUM(cantidadProducto) AS totalVendido FROM pedido GROUP BY idProducto ORDER BY totalVendido desc LIMIT 10");
        if(respuesta.length>0){
        res.json(respuesta);
        return ;
        }
        res.status(404).json({'mensaje': 'No hay productos'});
    }
    else{
    const respuesta = await pool.query("SELECT pe.idProducto,SUM(pe.cantidadProducto) AS totalVendido FROM pedido pe join compra co on co.idCompra=pe.idCompra where co.fecha between ? AND ? GROUP BY idProducto ORDER BY totalVendido desc LIMIT 10",[fechaInicio,fechaFin]);
    if(respuesta.length>0){
    res.json(respuesta);
    return ;
    }
    res.status(404).json({'mensaje': 'No hay productos'});
    }
}
public async buscarComprasUsuario(req: Request, res: Response): Promise <void>{
    const {id} = req.params;
    const respuesta = await pool.query("SELECT * FROM compra WHERE idCliente = ?",[id]);
    if(respuesta.length>0){
    res.json(respuesta);
    return ;
    }
    res.json(false);
    }
}
export const compraController = new CompraController();