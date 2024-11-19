import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAnserComponent } from './check-anser.component';

describe('CheckAnserComponent', () => {
  let component: CheckAnserComponent;
  let fixture: ComponentFixture<CheckAnserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckAnserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAnserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
