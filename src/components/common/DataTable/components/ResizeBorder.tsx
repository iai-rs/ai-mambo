import type { MouseEventHandler, TouchEventHandler } from "react";
import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  isResizing: boolean;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onTouchStart: TouchEventHandler<HTMLDivElement>;
};

/**
 * A component that renders a resize border which can be used to resize
 * adjacent elements in a UI. This border becomes fully opaque and changes color
 * when resizing is active, and it has a hover effect that makes it fully visible
 * when hovered over with a pointer device.
 *
 * @param isResizing - Indicates if the resize action is currently active.
 * @param onMouseDown - Handler for mouse down events to initiate resize.
 * @param onTouchStart - Handler for touch start events to initiate resize on touch devices.
 */
const ResizeBorder = ({ isResizing, onMouseDown, onTouchStart }: Props) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={cn(
        `
      absolute
      right-0
      top-0
      h-full
      w-[3px]
      cursor-col-resize
      touch-none
      select-none
      bg-[#303030]
      opacity-0 hover:opacity-100
      `,
        isResizing ? "bg-slate-700 opacity-100" : "hover:opacity-100",
      )}
    ></div>
  );
};

export default ResizeBorder;
