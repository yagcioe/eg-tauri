import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportModelComponent } from './import-model.component';

describe('ImportModelComponent', () => {
  let component: ImportModelComponent;
  let fixture: ComponentFixture<ImportModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
