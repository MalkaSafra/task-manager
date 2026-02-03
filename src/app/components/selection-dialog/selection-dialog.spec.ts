import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDialog } from './selection-dialog';

describe('SelectionDialog', () => {
  let component: SelectionDialog;
  let fixture: ComponentFixture<SelectionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
