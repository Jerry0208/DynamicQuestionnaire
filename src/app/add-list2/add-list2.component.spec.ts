import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddList2Component } from './add-list2.component';

describe('AddList2Component', () => {
  let component: AddList2Component;
  let fixture: ComponentFixture<AddList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddList2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
