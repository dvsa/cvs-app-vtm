import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeButtonComponent } from './components/home-button/home-button.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
	imports: [CommonModule, HomeRoutingModule, HomeComponent, HomeButtonComponent],
})
export class HomeModule {}
