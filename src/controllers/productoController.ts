import {Request,Response} from 'express';
import pool from '../database';

class ProductoController
{
    public async list(req: Request, res: Response ): Promise<void>
    {
        try{
        //const respuesta = await pool.query('SELECT * FROM producto');
        const respuesta = await pool.query('SELECT idProducto, nombre, descripcion,stock,precio,descuento,DATE(inicio_descuento),Date(fin_descuento),idMaterial,idCategoria,idMarca  FROM producto');
        res.json( respuesta );
        }
        catch{
            res.json(false);
        }
    }
    public async listOne(req: Request, res: Response): Promise <void>
    {
    const {id} = req.params;
    const respuesta = await pool.query('SELECT * FROM producto WHERE idProducto = ?', [id]);
    if(respuesta.length>0)
        {
        res.json(respuesta[0]);
        return ;
        }
    res.status(404).json({'mensaje': 'Producto no encontrado'});
    }

    public async create(req: Request, res: Response): Promise<void> 
    {
        try{
        const resp = await pool.query("INSERT INTO producto set ?",[req.body]);
        res.json(resp);
        }
        catch{
            res.json(false);
        }
    }

    public async update(req: Request, res: Response): Promise<void>
    {
        const { id } = req.params;
        console.log(req.params);
        //console.log(id)
        const resp = await pool.query("UPDATE producto set ? WHERE idProducto = ?", [req.body, id]);
        res.json(resp);
    }

    public async delete(req: Request, res: Response): Promise<void> 
    {
        const { id } = req.params;
        const resp = await pool.query("DELETE FROM producto WHERE idProducto =?",[id]);
        res.json(resp);
    }

    public async aplicarDescuento(req: Request, res: Response): Promise<void> 
    {
        const { id } = req.params;
        const{descuento}=req.body;
        console.log(descuento);
        //const resp = await pool.query("SELECT precio from  producto  WHERE idProducto = ?", [ id]);
        const resp = await pool.query("UPDATE producto set descuento=? WHERE idProducto = ?", [descuento,id]);
        res.json(resp);

    }
    public async filtrarProductos(req: Request, res: Response): Promise <void>{
        const {id} = req.params;
        const respuesta = await pool.query('SELECT * FROM producto WHERE idCategoria = ?', [id]);
        if(respuesta.length>0){
        res.json(respuesta);
        return ;
        }
        res.status(404).json({'mensaje': 'Producto no encontrados en esta categoria'});   
    }   
    public async prueba(req: Request, res: Response): Promise <void>{
        const resp= await pool.query('SELECT * FROM producto');
        res.json(resp);
    }


}

export const productoController = new ProductoController();