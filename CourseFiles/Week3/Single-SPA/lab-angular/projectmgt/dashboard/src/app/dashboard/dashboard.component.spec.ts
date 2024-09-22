import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize projects array', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    expect(app.projects).toEqual([]);
  });

  it('should load projects', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    await fixture.whenStable();

    expect(app.projects.length).toBeGreaterThan(0);
  });
});
