export interface ListItem {
  id: string;
  key: string;
  isObject?: boolean;
  items?: ListItem[];
  showDropdown?: boolean;
}
