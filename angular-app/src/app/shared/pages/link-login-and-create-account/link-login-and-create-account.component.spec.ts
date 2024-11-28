import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLoginAndCreateAccountComponent } from './link-login-and-create-account.component';

describe('LinkLoginAndCreateAccountComponent', () => {
  let component: LinkLoginAndCreateAccountComponent;
  let fixture: ComponentFixture<LinkLoginAndCreateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkLoginAndCreateAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLoginAndCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
