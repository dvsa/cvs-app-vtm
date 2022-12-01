import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode } from '@forms/services/dynamic-form.types';

@Directive({
  selector: '[appCharacterCount]'
})
export class CharacterCountDirective implements OnInit {
  @Input() metaData?: FormNode;

  private defaultHint = '';
  private characterCountId?: string;
  private maxLength?: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.characterCountId = this.el.nativeElement.id && `${this.el.nativeElement.id}-character-count`;
    this.maxLength = this.max;

    if (this.maxLength && this.characterCountId) {
      this.defaultHint = `You can enter up to ${this.maxLength} characters`;
      this.createCharacterCountEl();
    }
  }

  get max(): number {
    return (this.metaData?.validators && this.metaData.validators.find(v => v.name === ValidatorNames.MaxLength)?.args) || 0;
  }

  createCharacterCountEl() {
    const characterCountDiv = this.renderer.createElement('div');
    this.renderer.addClass(characterCountDiv, 'govuk-hint');
    this.renderer.addClass(characterCountDiv, 'govuk-character-count__message');
    this.renderer.setAttribute(characterCountDiv, 'id', this.characterCountId!);

    this.renderer.appendChild(characterCountDiv, this.renderer.createText(this.defaultHint));

    const parent = this.el.nativeElement.parentElement;
    this.renderer.insertBefore(parent.parentElement, characterCountDiv, this.renderer.nextSibling(parent));
  }

  @HostListener('input', ['$event'])
  onInput() {
    if (this.maxLength && this.characterCountId) {
      const characterCount: number = this.el.nativeElement.value.length;
      const characterCountEl = document.querySelector(`#${this.characterCountId}`);
      if (characterCountEl) {
        characterCountEl.textContent =
          characterCount === 0 ? this.defaultHint : `You have ${Math.max(this.maxLength - characterCount, 0)} characters remaining`;
      }
    }
  }
}
