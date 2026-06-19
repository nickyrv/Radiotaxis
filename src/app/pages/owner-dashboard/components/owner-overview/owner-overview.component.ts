import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-owner-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-overview.component.html',
  styleUrls: ['./owner-overview.component.css']
})
export class OwnerOverviewComponent {

  @Input() currentOwner: any = null;
  @Input() ownerVehicles: any[] = [];
  @Input() ownerPayments: any[] = [];
  @Input() ownerMaintenances: any[] = [];

  @Input() totalIncome = 0;
  @Input() totalExpenses = 0;
  @Input() netProfit = 0;

}