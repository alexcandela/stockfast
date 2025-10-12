import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductloteComponent } from './productlote-component';

describe('ProductloteComponent', () => {
  let component: ProductloteComponent;
  let fixture: ComponentFixture<ProductloteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductloteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductloteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
