import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackTransactionsComponent } from './track-transactions.component';

describe('TrackTransactionsComponent', () => {
  let component: TrackTransactionsComponent;
  let fixture: ComponentFixture<TrackTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
