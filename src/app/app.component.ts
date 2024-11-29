import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingService } from './service/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading$!: any;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading$ = this.loadingService.loading$;
  }

}
