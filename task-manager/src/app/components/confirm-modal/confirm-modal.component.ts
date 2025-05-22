import { Component, computed, inject } from '@angular/core';
import { ConfirmModalService } from './confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  modalData = computed(() => this.confirmModalService.data());

  private confirmModalService = inject(ConfirmModalService)

  onConfirm() {
    this.confirmModalService.close(true);
  }

  onCancel() {
    this.confirmModalService.close(false);
  }
}
