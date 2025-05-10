import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavWrapperComponent } from './sidenav-wrapper.component';

describe('SidenavWrapperComponent', () => {
  let component: SidenavWrapperComponent;
  let fixture: ComponentFixture<SidenavWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
