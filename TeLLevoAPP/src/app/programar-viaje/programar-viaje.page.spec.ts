import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgramarViajePage } from './programar-viaje.page';
import { ViajeService } from '../services/viaje.service';
import { Viaje } from '../interfaces/viaje.interface';

describe('ProgramarViajePage', () => {
  let component: ProgramarViajePage;
  let fixture: ComponentFixture<ProgramarViajePage>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ViajeService', ['programarViaje']);
    
    await TestBed.configureTestingModule({
      declarations: [ ProgramarViajePage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: ViajeService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramarViajePage);
    component = fixture.componentInstance;
    viajeServiceSpy = TestBed.inject(ViajeService) as jasmine.SpyObj<ViajeService>;
    
    // Asegurarse que el formulario esté inicializado
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.viajeForm instanceof FormGroup).toBeTruthy();
    expect(component.viajeForm.controls['origen'].value).toBe('');
    expect(component.viajeForm.controls['destino'].value).toBe('');
    expect(component.viajeForm.controls['fecha'].value).toBe('');
    expect(component.viajeForm.controls['hora'].value).toBe('');
    expect(component.viajeForm.controls['asientosDisponibles'].value).toBe(null);
  });

  it('should validate required fields', () => {
    expect(component.viajeForm.valid).toBeFalsy();
    component.viajeForm.controls['origen'].setValue('Origen Test');
    component.viajeForm.controls['destino'].setValue('Destino Test');
    component.viajeForm.controls['fecha'].setValue('2024-03-15');
    component.viajeForm.controls['hora'].setValue('10:00');
    component.viajeForm.controls['asientosDisponibles'].setValue(4);
    expect(component.viajeForm.valid).toBeTruthy();
  });
});