import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyScheduleComponent } from './company-schedule.component';

describe('CompanyScheduleComponent', () => {
  let component: CompanyScheduleComponent;
  let fixture: ComponentFixture<CompanyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
