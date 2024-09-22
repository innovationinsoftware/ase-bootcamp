import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { apiServiceInstance } from '@projectmgt/sharedstate';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  tasks: any[] = [];
  team: any[] = [];
  error: any = null;

  constructor() {}

  ngOnInit() {
    apiServiceInstance
      .getProjects()
      .then((data: any) => {
        this.projects = data;
      })
      .catch((error: any) => {
        this.error = 'Failed to load projects.';
      });

    apiServiceInstance
      .getTasks()
      .then((data: any) => {
        this.tasks = data;
      })
      .catch((error: any) => {
        this.error = 'Failed to load tasks.';
      });

    apiServiceInstance
      .getTeam()
      .then((data: any) => {
        this.team = data;
      })
      .catch((error: any) => {
        this.error = 'Failed to load team.';
      });
  }
}
