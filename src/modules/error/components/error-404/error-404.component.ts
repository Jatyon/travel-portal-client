import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'error-404',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './error-404.component.html',
	styleUrls: ['error-404.component.scss']
})
export class Error404Component {}
