export class Rol{
    constructor(
        public readonly id: string,
        public readonly nombre: string,
    ){
        if(this.nombre.trim().length === 0) {
            throw new Error('El nombre del rol es requerido');
        }

    }
}