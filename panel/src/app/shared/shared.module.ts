import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material';
import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  exports: [
    MatCardModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  providers: [MenuItems]
})
export class SharedModule { }
