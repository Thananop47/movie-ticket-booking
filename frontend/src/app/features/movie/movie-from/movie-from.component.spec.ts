import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFromComponent } from './movie-from.component';

describe('MovieFromComponent', () => {
  let component: MovieFromComponent;
  let fixture: ComponentFixture<MovieFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFromComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
