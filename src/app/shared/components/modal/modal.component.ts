import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal[id]',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() id!: string;
  @Input() open = false;
  @Output() closeModal = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    return;
  }
}
