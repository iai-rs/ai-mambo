import "@tanstack/react-table";
// Use type safe message keys with `next-intl`
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Messages = typeof import("./src/i18n/messages/en.json");
type IntlMessages = Messages;

type CheckboxFilterProps = { text: ReactElement; value: string };

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
    minMaxFilter?: boolean;
    checkboxFilterOptions?: CheckboxFilterProps[];
    checkboxFilterOptionsMints?: CheckboxFilterProps[];
    name?: string;
    header?: {
      customStyle: React.CSSProperties;
    };
  }

  interface FilterFns {
    favoriteFilter: FilterFn<unknown>;
    checkboxFilter: FilterFn<unknown>;
  }
}
