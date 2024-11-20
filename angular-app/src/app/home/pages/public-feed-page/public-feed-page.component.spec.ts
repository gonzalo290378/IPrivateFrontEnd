import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicFeedPageComponent } from './public-feed-page.component';

describe('PublicFeedPageComponent', () => {
  let component: PublicFeedPageComponent;
  let fixture: ComponentFixture<PublicFeedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicFeedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicFeedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
