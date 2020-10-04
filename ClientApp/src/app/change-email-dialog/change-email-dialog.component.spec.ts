import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailDialogComponent } from './change-email-dialog.component';

describe('ChangeEmailDialogComponent', () => {
  let component: ChangeEmailDialogComponent;
  let fixture: ComponentFixture<ChangeEmailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeEmailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
