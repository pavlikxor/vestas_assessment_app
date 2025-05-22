import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmModalService } from './confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [AsyncPipe],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  isOpen = false
  confirmModalService = inject(ConfirmModalService)

  onConfirm() {
    this.confirmModalService.close(true);
  }

  onCancel() {
    this.confirmModalService.close(false);
  }
}
