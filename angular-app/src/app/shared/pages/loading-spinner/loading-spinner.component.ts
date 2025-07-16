import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'shared-loading-spinner',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent {}
