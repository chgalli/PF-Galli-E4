import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../../../../shared/shared.module';

import { SubjectsRoutingModule } from './subjects-routing.module';
import { InscriptionsModule } from '../inscriptions/inscriptions.module';

import { SubjectsComponent } from './subjects.component';
import { SubjectFormComponent } from './components/subject-form/subject-form.component';

import { SubjectsService } from './subjects.service';
import { InscriptionsService } from '../inscriptions/inscriptions.service';

import { SubjectsEffects } from './store/subjects.effects';
import { subjectsFeature } from './store/subjects.reducer';


@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectFormComponent
  ],
  imports: [
    SharedModule,
    SubjectsRoutingModule,
    InscriptionsModule,
    StoreModule.forFeature(subjectsFeature),
    EffectsModule.forFeature([SubjectsEffects])    
  ],
  providers: [
    SubjectsService,
    InscriptionsService,
  ],
})
export class SubjectsModule { }
