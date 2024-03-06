import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, mergeMap, of } from 'rxjs';

import { CreateCursos, Cursos } from './Models';
import { Inscripciones } from "../inscriptions/Models";
import { Usuarios } from "../students/Models";
import { enviroment } from "../../../../../enviroments/enviroment";
import { InscriptionsService } from "../inscriptions/inscriptions.service";


let cursos: Cursos[] = [
   
]


@Injectable({providedIn: 'root'})

export class SubjectsService {

    constructor(private httpClient: HttpClient, private inscriptionService: InscriptionsService) { }
    
    getCursos() { 
        return this.httpClient.get<Cursos[]>(`${enviroment.apiURL}courses`);
    }


    deleteInscripcionesByID(id: string): Observable<any> {
        return this.httpClient.delete(`${enviroment.apiURL}inscriptions/${id}`)
            .pipe(
                mergeMap(() => this.inscriptionService.getInscripciones()) 
            );
    }


    deleteSubjectByID(id: string){ 
        return this.httpClient.delete(`${enviroment.apiURL}courses/${id}`)
    }

    addCurso(data: CreateCursos) {
        return this.httpClient.
        post<Cursos>(`${enviroment.apiURL}courses`,data)
    }

    updateCursos(id: string, data: Cursos) {
        cursos = cursos.map((el) => el.id === id ? {...el, ...data} : el);
        return this.httpClient.put<Cursos>(`${enviroment.apiURL}courses/${id}`, data)
    }
    

    comprobarAlumnos(dataC: Cursos, DataI: Inscripciones[]): Observable<Inscripciones[]> {
        return of(DataI.filter((el) => el.IDCurso === dataC.IDCurso));
    }

    comprobarCursos(dataA: Usuarios, DataI: Inscripciones[]): Observable<Inscripciones[]> {
        return of(DataI.filter((el) => el.IDAlumno === dataA.IDUsuario));
    }
}