import {Component, Input, OnDestroy} from '@angular/core';


@Component({
  selector: 'accordion',
  template:`
  <ng-content></ng-content>
          `,
  host: {
    'class': 'panel-group'
  }
})
export class Accordion {
  groups: Array<AccordionGroup> = [];

  addGroup(group: AccordionGroup): void {
    this.groups.push(group);
  }

  closeOthers(openGroup: AccordionGroup): void {
    this.groups.forEach((group: AccordionGroup) => {
      if (group !== openGroup) {
        group.isOpen = false;
      }
    });
  }

  removeGroup(group: AccordionGroup): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }
}

@Component({
  selector: 'accordion-group',
  // templateUrl: 'accordion.component.html',

  template:
  `<div class="panel panel-default" [ngClass]="{'panel-open': isOpen}">
    <div class="panel-heading" (click)="toggleOpen($event)">
      <h4 class="panel-title">
        <a href tabindex="0">
        <span class=" mdropdown-item dropdown-header">
          <!--
            <img *ngIf="_isOpen" class="twistie" src="assets/icons/twistie_on.png">
            <img *ngIf="!_isOpen" class="twistie" src="assets/icons/twistie_off.png">
          -->
          <img class="twistie" [src]="toggleImage">
          {{group.heading}}
        </span>
        </a>
      </h4>
    </div>
    <div class="panel-collapse" [hidden]="!isOpen">
      <div class="panel-body">
          <ng-content></ng-content>
      </div>
    </div>
  </div>`
})

export class AccordionGroup implements OnDestroy {
  public _isOpen:boolean = false;

  @Input() group: any;
  // @Input() heading: string;
  toggleImage;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
    this.toggleImage = this.getToggleImage();
  }

  get isOpen() {
    return this._isOpen;
  }

  constructor(private accordion: Accordion) {
    this.accordion.addGroup(this);
  }

  ngOnDestroy() {
    this.accordion.removeGroup(this);
  }

  ngOnInit() {
    this.toggleImage = this.getToggleImage();
  }

  toggleOpen(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.toggleImage = this.getToggleImage();
  }

  // ngDoCheck() {
  //
  // }

  isModified() {
    let modified = false;
    console.log('checking isModified : ',this.group.changeCount);
    if (this.group.changeCount > 0 ) {
      console.log('setting isModified to true.');
      modified = true;
    }
    return modified;
  }

  getToggleImage() {
    let src;
    if (!this.isModified()) {
      if (this.isOpen) {
        src = "assets/icons/twistie_on.png";
      } else {
        src = "assets/icons/twistie_off.png";
      }
    } else {
      if (this.isOpen) {
        src = "assets/icons/twistie_on_blue.png";
      } else {
        src = "assets/icons/twistie_off_blue.png";
      }
    }
    console.log('getToggleImage returning : ',src);
    return src;
  }
}
