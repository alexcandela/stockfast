import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stockfastpropage } from './stockfastpropage';

describe('Stockfastpropage', () => {
  let component: Stockfastpropage;
  let fixture: ComponentFixture<Stockfastpropage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stockfastpropage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stockfastpropage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
