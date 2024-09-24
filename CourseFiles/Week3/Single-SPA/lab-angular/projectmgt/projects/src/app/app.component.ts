import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { sharedStateService, emitEventInstance } from '@projectmgt/sharedstate';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import necessary modules here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  projects: any[] = [];
  newProject: any = {};
  sharedState: any;

  constructor() {}

  ngOnInit() {
    this.sharedState = sharedStateService.getState('projects') || {
      projects: [],
    };
    this.projects = this.sharedState.projects;
    this.newProject = {};
  }

  addProject() {
    if (this.newProject.name && this.newProject.description) {
      this.projects.push(this.newProject);
      this.updateSharedState('projects', this.projects);
      this.newProject = {}; // Reset form

      // Emit event to update data
      emitEventInstance('updateData', { projects: this.projects });
    } else {
      console.log('Form is invalid');
    }
  }

  updateSharedState = (key: string, value: any) => {
    sharedStateService.setState('projects', {
      ...this.sharedState,
      [key]: value,
    });
  };
}
