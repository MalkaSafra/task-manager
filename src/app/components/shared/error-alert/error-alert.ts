import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="error-alert">
      <mat-icon>error_outline</mat-icon>
      <span>{{ message }}</span>
      @if (showRetry) {
        <button mat-icon-button (click)="onRetry.emit()">
          <mat-icon>refresh</mat-icon>
        </button>
      }
      @if (showClose) {
        <button mat-icon-button (click)="onClose.emit()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .error-alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 24px;
      background: #ffebee;
      border-radius: 12px;
      border-left: 4px solid #f44336;
      color: #c62828;
    }

    .error-alert mat-icon:first-child {
      color: #f44336;
    }

    .error-alert span {
      flex: 1;
    }

    .error-alert button {
      color: #c62828;
    }
  `]
})
export class ErrorAlert {
  @Input() message = 'An error occurred';
  @Input() showRetry = true;
  @Input() showClose = false;
  @Output() onRetry = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
}
