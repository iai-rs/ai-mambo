import type { ReactNode } from "react";
import React from "react";

import { cn } from "~/lib/utils";

/**
 * Represents the possible alignment options for the header content.
 */
type AlignProps = "left" | "center" | "right";

/**
 * A lookup table to map alignment props to their respective flexbox justify-content values.
 */
const lookupAlignment: Record<AlignProps, string> = {
  left: "start",
  center: "center",
  right: "end",
};

type Props = {
  features: ReactNode;
  header: ReactNode;
  isLastItem: boolean;
  isFirstItem: boolean;
  isSortable: boolean;
  isPlaceholder: boolean;
  isLoading?: boolean;
  align?: AlignProps;
  onClick: ((event: unknown) => void) | undefined;
};

const HeaderContentWrapper = ({
  features,
  header,
  isLastItem,
  isFirstItem,
  isSortable,
  isPlaceholder,
  onClick,
  align = "left",
  isLoading = false,
}: Props) => {
  return (
    <div
      className={cn("w-auto  whitespace-nowrap px-3", {
        "border-r": !isLastItem && !isFirstItem,
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
