import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoComponent } from './terminado.component';

describe('TerminadoComponent', () => {
  let component: TerminadoComponent;
  let fixture: ComponentFixture<TerminadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
