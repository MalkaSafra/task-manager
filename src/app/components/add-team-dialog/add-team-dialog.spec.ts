import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamDialog } from './add-team-dialog';

describe('AddTeamDialog', () => {
  let component: AddTeamDialog;
  let fixture: ComponentFixture<AddTeamDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeamDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeamDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
