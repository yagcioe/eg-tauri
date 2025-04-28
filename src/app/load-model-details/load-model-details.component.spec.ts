import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModelDetailsComponent } from './load-model-details.component';

describe('LoadModelDetailsComponent', () => {
  let component: LoadModelDetailsComponent;
  let fixture: ComponentFixture<LoadModelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadModelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadModelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
