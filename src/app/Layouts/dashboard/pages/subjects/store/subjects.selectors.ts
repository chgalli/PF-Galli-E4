import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubjects from './subjects.reducer';

export const selectSubjectsState = createFeatureSelector<fromSubjects.State>(
  fromSubjects.subjectsFeatureKey
);


export const selectSubjects = createSelector(selectSubjectsState, (state) => state.cursos);