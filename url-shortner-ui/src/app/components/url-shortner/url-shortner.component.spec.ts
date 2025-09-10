import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlShortnerComponent } from './url-shortner.component';

describe('UrlShortnerComponent', () => {
  let component: UrlShortnerComponent;
  let fixture: ComponentFixture<UrlShortnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlShortnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrlShortnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
