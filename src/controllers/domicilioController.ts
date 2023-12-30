import {Request,Response} from 'express';
import pool from '../database';

class DomicilioController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT * FROM domicilio');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT * FROM domicilio WHERE idCliente = ?', [id]);
if(respuesta.length>0){
res.json(respuesta);
return ;
}
res.status(404).json({'mensaje': 'Domicilio no encontrado'});
}

public async create(req: Request, res: Response): Promise<void> {
const resp = await pool.query("INSERT INTO domicilio set ?",[req.body]);
res.json(resp);
}

public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
console.log(req.params);
//console.log(id)
const resp = await pool.query("UPDATE domicilio set ? WHERE idDomicilio = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query("DELETE FROM domicilio WHERE idDomicilio =?",[id]);
res.json(resp);
}
}

export const domicilioController = new DomicilioController();