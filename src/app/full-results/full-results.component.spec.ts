import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullResultsComponent } from './full-results.component';

describe('FullResultsComponent', () => {
  let component: FullResultsComponent;
  let fixture: ComponentFixture<FullResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
