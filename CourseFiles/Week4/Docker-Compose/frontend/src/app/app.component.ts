import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisitorsService } from './visitors.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-container-app';
  visitors: any[] = [];

  constructor(private visitorsService: VisitorsService) { }

  ngOnInit(): void {
    this.visitorsService.getVisitors().subscribe(data => {
      this.visitors = data;
    });
  }
}
