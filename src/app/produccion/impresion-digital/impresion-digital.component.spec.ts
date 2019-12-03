import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresionDigitalComponent } from './impresion-digital.component';

describe('ImpresionDigitalComponent', () => {
  let component: ImpresionDigitalComponent;
  let fixture: ComponentFixture<ImpresionDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpresionDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpresionDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
