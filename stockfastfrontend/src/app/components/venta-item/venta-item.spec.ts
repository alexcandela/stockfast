import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaItem } from './venta-item';

describe('VentaItem', () => {
  let component: VentaItem;
  let fixture: ComponentFixture<VentaItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
