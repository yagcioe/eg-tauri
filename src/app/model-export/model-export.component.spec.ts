import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelExportComponent } from './model-export.component';

describe('ModelExportComponent', () => {
  let component: ModelExportComponent;
  let fixture: ComponentFixture<ModelExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
