import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresionGfComponent } from './impresion-gf.component';

describe('ImpresionGfComponent', () => {
  let component: ImpresionGfComponent;
  let fixture: ComponentFixture<ImpresionGfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpresionGfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpresionGfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
