import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrivateContentPageComponent } from './edit-private-content-page.component';

describe('EditPrivateContentPageComponent', () => {
  let component: EditPrivateContentPageComponent;
  let fixture: ComponentFixture<EditPrivateContentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPrivateContentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrivateContentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
