import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of, Subject } from 'rxjs';
import { SubjectsActions } from './subjects.actions';
import { SubjectsService } from '../subjects.service';


@Injectable()
export class SubjectsEffects {

  loadSubjectsS$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(SubjectsActions.loadSubjects),
      concatMap(() =>
        this.subjectService.getCursos().pipe(
          map(data => SubjectsActions.loadSubjectsSuccess({ data })),
          catchError(error => of(SubjectsActions.loadSubjectsFailure({ error }))))
      )
    );
  });

  createSubject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.createSubjects),
      concatMap((action) => {
        return this.subjectService.addCurso(action.data).pipe(
          map((resp) => SubjectsActions.createSubjectsSuccess({ data: resp})),
          catchError((error) => of(SubjectsActions.createSubjectsFailure({error})))
        );
      })
    );
  });

  modifySubject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.modifySubjects),
      concatMap((action) => {
        return this.subjectService.updateCursos(action.id, action.data).pipe(
          map((resp) => SubjectsActions.modifySubjectsSuccess({  data: resp})),
          catchError((error) => of(SubjectsActions.modifySubjectsFailure({error})))
        );
      })
    );
  });

  deleteSubject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.deleteSubjects),
      concatMap((action) => {
        return this.subjectService.deleteSubjectByID(action.id).pipe(
          map(() => SubjectsActions.deleteSubjectsSuccess()),
          catchError((error) => of(SubjectsActions.deleteSubjectsFailure({error})))
        );
      })
    );
  });

  createSubjectSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.createSubjectsSuccess),
      map(() => SubjectsActions.loadSubjects())
    )
  })

  deleteSubjectSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.deleteSubjectsSuccess),
      map(() => SubjectsActions.loadSubjects())
    )
  })

  modifySubjectSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubjectsActions.modifySubjectsSuccess),
      map(() => SubjectsActions.loadSubjects())
    )
  })

  constructor(private actions$: Actions, private subjectService: SubjectsService) {}
}
