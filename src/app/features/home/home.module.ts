import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { HomeButtonComponent } from './components/home-button/home-button.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, HomeButtonComponent],
  imports: [CommonModule, HomeRoutingModule, DynamicFormsModule, FormsModule, ReactiveFormsModule]
})
export class HomeModule {}
