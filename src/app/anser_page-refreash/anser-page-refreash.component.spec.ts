import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnserPageRefreashComponent } from './anser-page-refreash.component';

describe('AnserPageRefreashComponent', () => {
  let component: AnserPageRefreashComponent;
  let fixture: ComponentFixture<AnserPageRefreashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnserPageRefreashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnserPageRefreashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
