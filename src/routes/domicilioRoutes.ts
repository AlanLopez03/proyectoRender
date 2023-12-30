import { Router } from 'express';
import { domicilioController } from '../controllers/domicilioController';

class DomicilioRoutes{
    public router: Router=Router();
    constructor(){
        this.config();
    }
    
    config() : void{
        //Ya funciona el crud
        this.router.post('/crearDomicilio', domicilioController.create);
        this.router.put('/actualizar/:id',domicilioController.update);//ya funciona
        this.router.delete('/eliminar/:id',domicilioController.delete);
        this.router.get('/', domicilioController.list );
        this.router.get('/:id', domicilioController.listOne );
        }
}
const domicilioRoutes= new DomicilioRoutes();
export default domicilioRoutes.router;