import { Router } from 'express';
import { productoController } from '../controllers/productoController';

class ProductoRoutes{
    public router: Router=Router();
    constructor(){
        this.config();
    }
    
    config() : void{
        this.router.post('/crearProducto', productoController.create);
        this.router.put('/actualizar/:id',productoController.update);//ya funciona
        this.router.delete('/eliminar/:id',productoController.delete);
        this.router.get('/', productoController.list );
        this.router.get('/:id', productoController.listOne );
        this.router.put('/aplicarDescuento/:id', productoController.aplicarDescuento );
        this.router.get('/filtrarProductos/:id', productoController.filtrarProductos );
        this.router.post('/buscarNombre', productoController.buscarporNombre );
        this.router.put ('/agregarStock/:id', productoController.agregarStock );
    }
}
const productoRoutes= new ProductoRoutes();
export default productoRoutes.router;