import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type TagTypes = 'blue' | 'green' | 'orange' | 'red' | 'yellow';
export const TagType = {
  BLUE: 'blue' as TagTypes,
  GREEN: 'green' as TagTypes,
  ORANGE: 'orange' as TagTypes,
  RED: 'red' as TagTypes,
  YELLOW: 'yellow' as TagTypes
};

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() type: TagTypes | string = TagType.BLUE;
}
