import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquilasComponent } from './maquilas.component';

describe('MaquilasComponent', () => {
  let component: MaquilasComponent;
  let fixture: ComponentFixture<MaquilasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaquilasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquilasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
