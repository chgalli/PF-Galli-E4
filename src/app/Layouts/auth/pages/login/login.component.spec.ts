import { TestBed } from "@angular/core/testing";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import Swal from 'sweetalert2';
import { of } from 'rxjs';

import { AuthRoutingModule } from '../../auth-routing.module';
import { LoginComponent } from "./login.component"
import { MockProvider } from "ng-mocks";
import { AuthService } from "../../auth.service";

describe('LoginComponent', () => {

    let component: LoginComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [MockProvider(AuthService)],
            imports: [
                CommonModule,
                AuthRoutingModule,
                FormsModule,
                MatToolbarModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                FlexLayoutModule,
                MatIconModule,
                ReactiveFormsModule,
              ],
        })
        component = TestBed.createComponent(LoginComponent).componentInstance;
    });

    it('El LoginComponent se instancia correctamente', () => {
        expect(component).toBeTruthy()
    })

    it('El email y clave deben ser requeridos', () => {
        expect(component.loginForm.get('email')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.loginForm.get('clave')?.hasValidator(Validators.required)).toBeTrue();
    })

    it('Prueba de formulario invalido con campos en touched', () => {
        const spyOnMarkAllAsTouched = spyOn(component.loginForm,'markAllAsTouched');
        component.loginForm.patchValue({
            email: '',
            clave: '',
        });
        expect(component.loginForm.invalid).toBeTrue();
        component.onSubmit();
        expect(spyOnMarkAllAsTouched).toHaveBeenCalled();
    })

    it('Prueba de formulario válido con campos llenos', () => {
        component.loginForm.patchValue({
            email: 'test@example.com',
            clave: 'password123',
        });
        expect(component.loginForm.valid).toBeTrue();
    });
    
    it('debería inicializar el formulario de inicio de sesión con campos vacíos', () => {
        const controlEmail = component.loginForm.get('email');
        const controlClave = component.loginForm.get('clave');
    
        expect(controlEmail?.value).toBe('');
        expect(controlClave?.value).toBe('');
      });

    it('Prueba de envío de formulario exitoso', () => {
        const authService = TestBed.inject(AuthService);
        const spyOnLogin = spyOn(authService, 'login');
        component.loginForm.patchValue({
            email: 'test@example.com',
            clave: 'password123',
        });
        component.onSubmit();
        expect(spyOnLogin).toHaveBeenCalledWith({ email: 'test@example.com', clave: 'password123' });
    });
    

    
    
})