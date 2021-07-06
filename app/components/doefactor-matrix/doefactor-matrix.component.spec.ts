import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DOEFactorMatrixComponent } from './doefactor-matrix.component';

describe('DOEFactorMatrixComponent', () => {
  let component: DOEFactorMatrixComponent;
  let fixture: ComponentFixture<DOEFactorMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DOEFactorMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DOEFactorMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
