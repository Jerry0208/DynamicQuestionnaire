import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookAnserComponent } from './look-anser.component';

describe('LookAnserComponent', () => {
  let component: LookAnserComponent;
  let fixture: ComponentFixture<LookAnserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookAnserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookAnserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
