import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeButtonComponent } from './components/home-button/home-button.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, HomeButtonComponent],
  imports: [CommonModule, HomeRoutingModule, FormsModule]
})
export class HomeModule {}
