import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router desde '@angular/router'

import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { StudentsService } from '../dashboard/pages/students/students.service';
import { Usuarios } from '../dashboard/pages/students/Models';


describe('AuthService', () => {
    let authService: AuthService;
    let studentsServiceSpy: jasmine.SpyObj<StudentsService>;

    beforeEach(() => {
        const studentsServiceSpyObj = jasmine.createSpyObj('StudentsService', ['getAuth']);

        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule], // Asegúrate de importar RouterTestingModule
            providers: [
                AuthService,
                { provide: StudentsService, useValue: studentsServiceSpyObj }
            ]
        });

        authService = TestBed.inject(AuthService);
        studentsServiceSpy = TestBed.inject(StudentsService) as jasmine.SpyObj<StudentsService>;
    });

    it('AuthService esta definido', () => {
        expect(authService).toBeTruthy();
    });

    it('Se autentica un usuario en authUser cuando me logeo', () => {
        const mockUser: Usuarios = {
            "IDUsuario": 1,
            "Nombre": "Juan",
            "Apellido": "Perez",
            "Dni": "28456789",
            "Telefono": "1124251645",
            "Correo": "prueba@gmail.com",
            "Direccion": "Calle A, Ciudad X",
            "Usuario": "JuanP",
            "Clave": "clave",
            "Rol": "Estudiante",
            "id": "c482"
        };

        studentsServiceSpy.getAuth.and.returnValue(of(mockUser));

        authService.login({ email: 'prueba@gmail.com', clave: 'clave' });

        expect(authService.authUser).toEqual(mockUser);
        expect(authService.token).toBeTruthy();
    });
    
    it('Cierra sesión correctamente', () => {
        authService.authUser = {
            "IDUsuario": 1,
            "Nombre": "Juan",
            "Apellido": "Perez",
            "Dni": "28456789",
            "Telefono": "1124251645",
            "Correo": "prueba@gmail.com",
            "Direccion": "Calle A, Ciudad X",
            "Usuario": "JuanP",
            "Clave": "clave",
            "Rol": "Estudiante",
            "id": "c482"
        };
        authService.token = 'mockToken';
    
        spyOn(localStorage, 'removeItem');
    
        authService.logout();
    
        expect(authService.authUser).toBeNull();
        expect(authService.token).toBe(''); // Expectativa ajustada para verificar que el token se establece como una cadena vacía
        expect(localStorage.removeItem).toHaveBeenCalledWith('authUser');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
    
    it('Verifica el token correctamente', () => {
        localStorage.setItem('token', 'mockToken');
    
        authService.verifyToken().subscribe(isValid => {
            expect(isValid).toBeTruthy();
        });
    });
    
    it('Maneja la sesión autenticada al iniciar la aplicación', () => {
        const storedUser = {
            "IDUsuario": 1,
            "Nombre": "Juan",
            "Apellido": "Perez",
            "Dni": "28456789",
            "Telefono": "1124251645",
            "Correo": "prueba@gmail.com",
            "Direccion": "Calle A, Ciudad X",
            "Usuario": "JuanP",
            "Clave": "clave",
            "Rol": "Estudiante",
            "id": "c482"
        };
        localStorage.setItem('authUser', JSON.stringify(storedUser)); // Simular un usuario autenticado almacenado en el almacenamiento local
    
        authService = new AuthService(TestBed.inject(Router), TestBed.inject(StudentsService)); // Reinstancia el servicio para simular el inicio de la aplicación
    
        expect(authService.authUser).toEqual(storedUser); // Verificar que el usuario autenticado se cargue correctamente
        // Puedes agregar más expectativas según sea necesario para verificar el estado de la sesión al iniciar la aplicación
    });

    
});
