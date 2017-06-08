import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionGroup } from './accordion/accordion.component';
import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
  declarations: [MultiselectDropdown, MultiSelectSearchFilter, Accordion, AccordionGroup],
})
export class MultiselectDropdownModule { }
