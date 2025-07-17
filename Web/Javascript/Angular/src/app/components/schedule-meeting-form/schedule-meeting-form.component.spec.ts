import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMeetingFormComponent } from './schedule-meeting-form.component';

describe('ScheduleMeetingFormComponent', () => {
  let component: ScheduleMeetingFormComponent;
  let fixture: ComponentFixture<ScheduleMeetingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleMeetingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
