import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type TagType = 'blue' | 'green' | 'orange' | 'red' | 'yellow';
export const TagType = {
  BLUE: 'blue' as TagType,
  GREEN: 'green' as TagType,
  ORANGE: 'orange' as TagType,
  RED: 'red' as TagType,
  YELLOW: 'yellow' as TagType
};

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  @Input() type: TagType = TagType.BLUE;
}
