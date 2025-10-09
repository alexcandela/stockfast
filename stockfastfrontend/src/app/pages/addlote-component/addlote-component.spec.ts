import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddloteComponent } from './addlote-component';

describe('AddloteComponent', () => {
  let component: AddloteComponent;
  let fixture: ComponentFixture<AddloteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddloteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddloteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
