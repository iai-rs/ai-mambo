import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface SelectedItem {
  key: string;
  label: string | React.ReactNode;
}

interface Props {
  items: SelectedItem[];
  selectedItem: string;
  fixedTitle?: string;
  disabled?: boolean;
  onValueChange: (item: string) => void;
}

/**
 * A custom select component that displays a dropdown of selectable options.
 *
 * The component allows for a fixed title to be displayed on the select trigger,
 * overriding the display of the selected item's label. If no fixed title is provided,
 * the label of the selected item is displayed.
 *
 * @param items - The selectable items to display in the dropdown.
 * @param selectedItem - The key of the item currently selected.
 * @param fixedTitle - An optional string to always display on the select trigger.
 * @param onValueChange - A function called with the key of the newly selected item.
 * @param disabled - Optional Disabled flag, defaults to `false`
 * @returns The MSelect component.
 */
const MSelect = ({
  items,
  onValueChange,
  selectedItem,
  fixedTitle,
  disabled = false,
}: Props) => {
  // Determine the label of the selected item, if available.
  const selectedItemLabel = items.find(
    (item) => item.key === selectedItem,
  )?.label;

  return (
    <Select onValueChange={onValueChange} value={selectedItem}>
      <SelectTrigger
        disabled={disabled}
        className="
          dark:bg-step-black
          w-auto
          max-w-[180px]
          gap-2
          font-semibold
          ring-offset-white
          focus:outline-none
          focus:ring-neutral-950
          dark:border-neutral-800
          dark:focus:ring-neutral-300
          "
      >
        <SelectValue placeholder="choose">
          {fixedTitle ?? selectedItemLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="dark:bg-step-black">
        <SelectGroup>
          {items.map(({ key, label }) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MSelect;
