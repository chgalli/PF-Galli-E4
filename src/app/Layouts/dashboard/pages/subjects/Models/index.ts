export interface Cursos{
    IDCurso: number;
    Nombre: string;
    FechaInicio: Date;
    FechaFin: Date;
    Docente: string;
    Costo: number;
    Modalidad: string;
    Capacidad: number;
    Inscriptos: number;
    Estado: boolean;
    Descripcion: string;
    Turno: string;
    id: string;
}

export interface CreateCursos{
    Nombre: string;
    FechaInicio: Date;
    FechaFin: Date;
    Docente: string;
    Costo: number;
    Modalidad: string;
    Capacidad: number;
    Inscriptos: number;
    Descripcion: string;
    Turno: string;
}