import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemKeyDialogComponent } from './redeem-key-dialog.component';

describe('RedeemKeyDialogComponent', () => {
  let component: RedeemKeyDialogComponent;
  let fixture: ComponentFixture<RedeemKeyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemKeyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
