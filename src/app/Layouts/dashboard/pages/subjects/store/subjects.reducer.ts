import { createFeature, createReducer, on } from '@ngrx/store';
import { SubjectsActions } from './subjects.actions';
import { Cursos } from '../Models';

export const subjectsFeatureKey = 'subjects';

export interface State {
  cursos: Cursos[];
  loading: boolean;
  error: unknown;
}

export const initialState: State = {
  cursos: [],
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(SubjectsActions.loadSubjects, state => ({...state, loading:true})),
  on(SubjectsActions.loadSubjectsSuccess, (state, action) => ({...state, loading:false, cursos: action.data})),
  on(SubjectsActions.loadSubjectsFailure, (state, action) => ({...state, loading:false, error: action.error})),
);

export const subjectsFeature = createFeature({
  name: subjectsFeatureKey,
  reducer,
});

