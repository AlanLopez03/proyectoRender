import {Request,Response} from 'express';
import pool from '../database';

class CarritoController{
    public async buscar(req: Request, res: Response ): Promise<void>
    {
        const {nombreProducto} = req.body;
        try
        {
            //Se supone recibe el nombre del producto y busca en la base de datos si existe
            const respuesta = await pool.query('SELECT * FROM producto WHERE nombre = ?',[nombreProducto]);
            if(respuesta.length>0)
            {
                res.json(respuesta[0]);
                return ;
            }
            res.json(false);
        }
        catch
        {
            res.json(false);
        }
    }
    public async insertarProducto(req: Request, res: Response ): Promise<void>{
        const {idProducto} = req.body;
        const {idCliente} = req.body;
        const {cantidad} = req.body;
        console.log(idCliente);
        console.log(idProducto);
        console.log(cantidad);
        try
{       //const stock= await pool.query('SELECT stock FROM producto WHERE idProducto = ?',[idProducto]);
        const buscar= await pool.query('SELECT * FROM carrito WHERE idProducto = ? AND idCliente = ?',[idProducto,idCliente]);
        //console.log(buscar.length);
        if(buscar.length>0)
        {
            
            const inventario= await pool.query("UPDATE producto pro join carrito ca on pro.idProducto=ca.idProducto set pro.stock=pro.stock-? WHERE ca.idCliente = ? AND pro.stock >= ?", [cantidad,idCliente,cantidad]);
            const respuesta = await pool.query('UPDATE carrito SET cantidad =cantidad+ ? WHERE idProducto = ? AND idCliente = ?',[cantidad,idProducto,idCliente]);
            if (respuesta.affectedRows > 0)
                res.json(respuesta);
            else
                res.json(false);
        }
        else
        {
            const respuesta = await pool.query('INSERT INTO carrito (idProducto,idCliente,cantidad) VALUES (?,?,?)',[idProducto,idCliente,cantidad]);
            const inventario= await pool.query("UPDATE producto pro join carrito ca on pro.idProducto=ca.idProducto set pro.stock=pro.stock-ca.cantidad WHERE ca.idCliente = ?", [idCliente]);
            res.json(respuesta);
            return;
        }}
        catch
        {
            res.json(false);
        }
    }

    public async verCarrito(req: Request, res: Response): Promise <void>{
        const {id} = req.params;
        try
        {const respuesta = await pool.query("SELECT pro.idProducto,pro.nombre,ca.cantidad,pro.precio,pro.stock,pro.descuento FROM carrito ca join producto pro on pro.idProducto=ca.idProducto   WHERE ca.idCliente = ?", [id]);
        if (respuesta.length > 0) 
        {
            const carritoConSubtotales = respuesta.map((item: any) => {
                const subtotal = item.cantidad * item.precio*item.descuento;
                return { ...item, subtotal };  
            });
    
            res.json(carritoConSubtotales);
           
        } 
        else 
            res.json(false);}
        catch
        {
            res.json(false);
        }
        

    }

    public async limpiarCarrito(req: Request, res: Response): Promise<void>
    {
        const {id} = req.params;
        const respuesta = await pool.query('DELETE FROM carrito WHERE idCliente = ?', [id]);
    
        res.json(respuesta);
    }
    public async eliminarProducto(req: Request, res: Response): Promise<void>{
        const {id}=req.params;
        const respuesta = await pool.query('DELETE FROM carrito WHERE idProducto = ?', [id]);
        res.json(respuesta);
    }



}

export const carritoController = new CarritoController();