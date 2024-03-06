import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCursos, Cursos } from '../Models';

export const SubjectsActions = createActionGroup({
  source: 'Subjects',
  events: {
    'Load Subjects': emptyProps(),
    'Load Subjects Success': props<{ data: Cursos[] }>(),
    'Load Subjects Failure': props<{ error: unknown }>(),

    'Create Subjects': props<{data: CreateCursos}>(),
    'Create Subjects Success': props<{ data: Cursos}>(),
    'Create Subjects Failure': props<{ error: unknown }>(),

    'Delete Subjects': props<{id: string}>(),
    'Delete Subjects Success': emptyProps(),
    'Delete Subjects Failure': props<{ error: unknown }>(),

    'Modify Subjects': props<{id: string, data: Cursos}>(),
    'Modify Subjects Success': props<{ data: Cursos}>(),
    'Modify Subjects Failure': props<{ error: unknown }>(),
  }
});
