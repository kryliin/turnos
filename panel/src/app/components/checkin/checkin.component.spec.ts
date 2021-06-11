import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChackInComponent } from './checkin.component';

describe('ReservaComponent', () => {
  let component: ChackInComponent;
  let fixture: ComponentFixture<ChackInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChackInComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChackInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
