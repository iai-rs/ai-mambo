import type { ReactNode } from "react";
import React from "react";

import { cn } from "~/lib/utils";

/**
 * Represents the possible alignment options for the header content.
 */
type AlignProps = "left" | "center" | "right";

type Props = {
  features: ReactNode;
  header: ReactNode;
  isLastItem: boolean;
  isSortable: boolean;
  isPlaceholder: boolean;
  isLoading?: boolean;
  align?: AlignProps;
  onClick: ((event: unknown) => void) | undefined;
};

/**
 * A lookup table to map alignment props to their respective flexbox justify-content values.
 */
const lookupAlignment: Record<AlignProps, string> = {
  left: "start",
  center: "center",
  right: "end",
};

/**
 * A functional component that wraps header content with additional functionality and styling.
 * It supports conditional rendering based on its props, such as being a placeholder or the last item,
 *
 * @param props - An object containing properties to configure the component.
 * @param features - ReactNode elements to be displayed alongside the header content.
 * @param header - The main content or title to be displayed in the header, typically a React node.
 * @param isLastItem - Determines if the current header is the last item, affecting border rendering.
 * @param isSortable - Indicates whether the header is sortable, enabling click interactions.
 * @param isPlaceholder - Specifies if the current header is a placeholder, in which case no content will be rendered.
 * @param isLoading - (Optional) Indicates if the header is in a loading state, which disables sorting interactions. Defaults to `false`.
 * @param align - (Optional) Specifies the horizontal alignment of the header content. Defaults to `"left"`.
 * @param onClick - A function to handle click events, which is only active when `isSortable` is true and `isLoading` is false. Can be undefined.
 * @returns A JSX element representing the header content wrapper.
 */
const HeaderContentWrapper = ({
  features,
  header,
  isLastItem,
  isSortable,
  isPlaceholder,
  onClick,
  align = "left",
  isLoading = false,
}: Props) => {
  return (
    <div
      className={cn("w-auto border-r-slate-500/30 px-3", {
        "border-r": !isLastItem,
      })}
    >
      {isPlaceholder ? null : (
        <div
          className={cn(
            { ["cursor-pointer select-none"]: isSortable && !isLoading },
            "flex items-center gap-2",
          )}
          {...{
            onClick,
          }}
        >
          <div className="flex-1">
            <div className={`flex justify-${lookupAlignment[align]}`}>
              {header}
            </div>
          </div>
          {features}
        </div>
      )}
    </div>
  );
};

export default HeaderContentWrapper;
