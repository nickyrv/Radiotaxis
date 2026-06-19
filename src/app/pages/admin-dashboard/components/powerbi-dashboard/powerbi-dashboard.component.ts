import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-powerbi-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './powerbi-dashboard.component.html',
  styleUrls: ['./powerbi-dashboard.component.css']
})
export class PowerbiDashboardComponent {

  powerBiUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiNmI0NTkyZmQtODYyZC00YWE3LWFlZDctMGJhYTJjYWMzOTFjIiwidCI6ImNjMjg2MzNmLTEyYjgtNDZjYi1iYzE1LTk1MWRhZTIzOWI0ZCIsImMiOjR9'
    );
  }

}