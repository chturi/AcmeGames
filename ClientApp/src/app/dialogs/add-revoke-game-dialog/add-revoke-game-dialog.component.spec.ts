import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRevokeGameDialogComponent } from './add-revoke-game-dialog.component';

describe('AddRevokeGameDialogComponent', () => {
  let component: AddRevokeGameDialogComponent;
  let fixture: ComponentFixture<AddRevokeGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRevokeGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRevokeGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
