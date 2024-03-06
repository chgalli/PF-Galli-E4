import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

import { Cursos } from '../../Models';
import { SubjectsService } from '../../subjects.service';
import { InscriptionsService } from '../../../inscriptions/inscriptions.service';
import { Inscripciones } from '../../../inscriptions/Models/index';
import { AuthService } from '../../../../../auth/auth.service';
import { SubjectsActions } from '../../store/subjects.actions';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent {

  subjectForm: FormGroup;
  inscripciones: any[] = [];
  inscripcionesAlumno: any[] = [];
  viewMode: boolean;
  authUser: any;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { curso: Cursos, view: boolean, edit: boolean },
    private subjectsService: SubjectsService,
    private inscriptionService: InscriptionsService,
    private authService: AuthService,
    private store: Store) {
    this.viewMode = this.data.view;
    this.subjectForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ -]+$')]], // Permitir letras, espacios y caracteres acentuados
      FechaInicio: ['', [Validators.required]],
      FechaFin: [''],
      Docente: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ -]+$')]], // Permitir letras, espacios y caracteres acentuados
      Capacidad: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]],
      Inscriptos: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]],
      Descripcion: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ -]+$')]], // Permitir letras, espacios y caracteres acentuados
      Costo: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(0.01)]],
      Modalidad: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ -]+$')]], // Permitir letras, espacios y caracteres acentuados
      Turno: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ -]+$')]], // Permitir letras, espacios y caracteres acentuados
    });

    
    if (this.data.edit) {
      this.subjectForm.patchValue(this.data.curso);
    }
    if (this.data.view) {
      this.subjectForm.patchValue(this.data.curso);
      this.subjectForm.get('Nombre')?.disable();
      this.subjectForm.get('FechaInicio')?.disable();
      this.subjectForm.get('FechaFin')?.disable();
      this.subjectForm.get('Docente')?.disable();
      this.subjectForm.get('Capacidad')?.disable();
      this.subjectForm.get('Inscriptos')?.disable();
      this.subjectForm.get('Descripcion')?.disable();
      this.subjectForm.get('Costo')?.disable();
      this.subjectForm.get('Modalidad')?.disable();
      this.subjectForm.get('Turno')?.disable();
    }
  }

  ngOnInit() {
    this.obtenerCursos();
    this.authUser = this.authService.authUser;
  }

  guardar(): void {
    if (this.subjectForm.invalid) {
      this.markFormGroupTouched(this.subjectForm);
      this.showErrorMessage('Por favor, complete todos los campos correctamente.');
      return;
    }else{
      if (!this.data.edit && !this.data.view){
        this.store.dispatch(SubjectsActions.createSubjects({data: this.subjectForm.value}));
      }
    }
    this.dialogRef.close(this.subjectForm.value);
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onDelete(data: Inscripciones) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      background: 'DarkGray',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectsService.deleteInscripcionesByID(data.id).subscribe({
          next: () => {
            this.obtenerCursos();
            Swal.fire({
              icon: 'success',
              title: 'Baja exitosa',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar la inscripción: ' + error,
            });
          }
        });
      }
    });
  }

  obtenerCursos(): void {
    this.subjectsService.getCursos().subscribe({
      next: (cursos: Cursos[]) => {

        this.inscriptionService.getInscripciones().subscribe({
          next: (inscripciones: any[]) => {
            this.inscripciones = inscripciones;

            const cursoActual = cursos.find(curso => curso.IDCurso === this.data.curso.IDCurso);
            if (cursoActual) {
              this.subjectsService.comprobarAlumnos(cursoActual, inscripciones).subscribe({
                next: (inscripcionesAlumno: any[]) => {
                  this.inscripcionesAlumno = inscripciones.filter(inscripcion => inscripcion.IDCurso === cursoActual.IDCurso);
                },
                error: (error) => {
                  alert(error);
                }
              });
              
            }
          },
          error: (error) => {
            alert(error);
          }
        });
      },
      error: (error) => {
        alert(error);
      }
    });
  }
}
