import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TagTypes = 'blue' | 'green' | 'orange' | 'red' | 'yellow' | 'purple' | 'grey' | 'black' | 'white';
export const TagType = {
	BLACK: 'black' as TagTypes,
	WHITE: 'white' as TagTypes,
	BLUE: 'blue' as TagTypes,
	GREEN: 'green' as TagTypes,
	ORANGE: 'orange' as TagTypes,
	RED: 'red' as TagTypes,
	YELLOW: 'yellow' as TagTypes,
	PURPLE: 'purple' as TagTypes,
	GREY: 'grey' as TagTypes,
};

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass],
})
export class TagComponent {
	readonly type = input<string>(TagType.BLUE);
}
