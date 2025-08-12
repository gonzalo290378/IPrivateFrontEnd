import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomPageComponent } from './meeting-room-page.component';

describe('MeetingRoomPageComponent', () => {
  let component: MeetingRoomPageComponent;
  let fixture: ComponentFixture<MeetingRoomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingRoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
