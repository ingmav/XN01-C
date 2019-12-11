import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelInicialComponent } from './panel-inicial.component';

describe('PanelInicialComponent', () => {
  let component: PanelInicialComponent;
  let fixture: ComponentFixture<PanelInicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelInicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
