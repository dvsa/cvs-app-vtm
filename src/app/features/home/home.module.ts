import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeButtonComponent } from './components/home-button/home-button.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TechRecordsRoutingModule } from '../tech-record/tech-record-routing.module';

@NgModule({
  declarations: [HomeComponent, HomeButtonComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule, TechRecordsRoutingModule]
})
export class HomeModule {}
