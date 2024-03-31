// adapted from https://jasonwatmore.com/post/2023/01/03/angular-14-modal-popup-dialog-tutorial-with-example
import { Injectable } from '@angular/core';
import { ModalComponent } from '../../../modal/modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private activeModals: ModalComponent[] = [];

    add(modal: ModalComponent) {
        if (!modal.id || this.activeModals.find(activeModal => activeModal.id === modal.id)) {
            throw new Error('Modal must have a unique id attribute');
        }

        this.activeModals.push(modal);
    }

    remove(modal: ModalComponent) {
        this.activeModals = this.activeModals.filter(activeModal => activeModal === modal);
    }

    open(modalId: string) {
        const modal = this.activeModals.find(activeModal => activeModal.id === modalId);

        if (!modal) {
            throw new Error(`Modal '${modalId}' not found`);
        }

        modal.open();
    }

    close() {
        const modal = this.activeModals.find(activeModal => activeModal.isOpen);
        modal?.close();
    }
}
