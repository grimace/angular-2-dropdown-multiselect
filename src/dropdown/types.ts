export enum Relation {
   INDEPENDENT = 1,
   CONTROLLER,
   INVERSE,
   EXCLUSIVE
}

export enum GUARDTYPE {
   ALLOW = 1,
   PREVENT,
   PARENT,
   COLLECTIVE
}

export interface IMultiSelectOptionGroup {
  id?: any;
  name?: any;
  type?: any;
  options?: any [];
  heading?: string;
  open?: boolean;
  content?: any [];

}

export interface ISelectionModel {
  id?: any;
  on?: boolean;
  enabled?: boolean;
  selected?: boolean;
}

export interface IMultiSelectOption {
  id?: any;
  name?: any;
  type?: any;
  parentId?: any;
  params?: any;
  description?: any;
  value?: any;
  image?:any;
  on?: boolean;
  enabled?: boolean;
  selected?: boolean;
  group?: IMultiSelectOption [];
  // guardGroup?: IMultiSelectOption [];
  guardType?: GUARDTYPE;
  guard?: boolean;
  dropDownGroup?: any;
  multiplier?:number;
  valueType?:any;
  option?: any;
}

export interface IMultiSelectSettings {
  pullRight?: boolean;
  enableSearch?: boolean;
  checkedStyle?: 'checkboxes' | 'glyphicon' | 'fontawesome';
  buttonClasses?: string;
  itemClasses?: string;
  containerClasses?: string;
  selectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  searchText?: string;
  displayAllSelectedText?: boolean;
  dropdownSettings?: IMultiSelectSettings;
  operators?:any[];
  operator?: string;
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
  allSelected?: string;
}
