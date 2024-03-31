// adapted from https://jasonwatmore.com/post/2023/01/03/angular-14-modal-popup-dialog-tutorial-with-example
import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id?: string;
  isOpen = false;
  private element: HTMLElement;

  constructor(private modalService: ModalService, private elementRef: ElementRef) {
      this.element = elementRef.nativeElement;
  }

  ngOnInit() {
      this.modalService.add(this);

      document.body.appendChild(this.element);
      this.element.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target && target.className === 'modal') {
            this.close();
        }
      });
  }

  ngOnDestroy() {
      this.modalService.remove(this);
      this.element.remove();
  }

  open() {
      this.element.style.display = 'block';
      document.body.classList.add('modal-open');
      this.isOpen = true;
  }

  close() {
      this.element.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.isOpen = false;
  }
}
