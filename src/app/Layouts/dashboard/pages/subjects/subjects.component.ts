import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Cursos } from './Models';
import { SubjectFormComponent } from './components/subject-form/subject-form.component';
import { AuthService } from '../../../auth/auth.service';
import { SubjectsActions } from './store/subjects.actions';
import { selectSubjects } from './store/subjects.selectors';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnDestroy {
  displayedColumns = ['Nombre', 'FechaInicio', 'FechaFin', 'Acciones'];

  cursos: Cursos[] = [];

  cursosSubscription?: Subscription;

  authUser: any;

  constructor(public dialog: MatDialog,
      private authService: AuthService,
      private store: Store) {
        
    this.cursosSubscription = this.store.select(selectSubjects).subscribe({
      next: (subjects) => {
        this.cursos = subjects;
      }
    })
    this.store.dispatch(SubjectsActions.loadSubjects())

  }

  ngOnInit(): void {
    this.authUser = this.authService.authUser;
  }
  
  onCreate(): void {
    this.dialog.open(SubjectFormComponent,{
      data: {view: false, edit: false}
    })
  }

  onEdit(curso: Cursos){
    this.dialog.open(SubjectFormComponent, {
      data: {view: false, edit: true, curso}
    }).afterClosed().subscribe({
      next: (result) => {
        if(result){
          this.store.dispatch(SubjectsActions.modifySubjects({ id: curso.id, data: result}));
        }
      }
    })
  }

  onDelete(curso: Cursos) {
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
        this.store.dispatch(SubjectsActions.deleteSubjects({id: curso.id}));
      }
    });
  }

  onView(cursos: Cursos){
    this.dialog.open(SubjectFormComponent, {
      data: { view: true, edit: false, curso: cursos}
    })
  }

  ngOnDestroy(): void {
      this.cursosSubscription?.unsubscribe();
  }
}
