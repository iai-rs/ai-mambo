/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React, { useEffect, useRef } from "react";
import {
  RenderingEngine,
  type Types,
  Enums,
  imageLoader,
} from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
// import { ToolGroupManager } from "@cornerstonejs/tools";
import initDemo from "~/utils/initDemo";

const {
  MagnifyTool,
  PanTool,
  ZoomTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

type Props = {
  fileUrl: string;
};

const toolGroupId = "STACK_TOOL_GROUP_ID_VD";
const renderEngineId = "renderEngineId";

cornerstoneTools.addTool(MagnifyTool);
cornerstoneTools.addTool(PanTool);
cornerstoneTools.addTool(ZoomTool);

const CornerstoneViewer = ({ fileUrl }: Props) => {
  const dicomElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // This function initializes the viewer
    async function initializeViewer() {
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      await initDemo();

      // Add tools to Cornerstone

      const isRegisteredToolGroup =
        !!ToolGroupManager.getToolGroup(toolGroupId);
      console.log({ isRegisteredToolGroup });

      if (toolGroup) {
        toolGroup.addTool(MagnifyTool.toolName);
        toolGroup.addTool(PanTool.toolName);
        toolGroup.addTool(ZoomTool.toolName);

        toolGroup.setToolActive(MagnifyTool.toolName, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
        toolGroup.setToolActive(PanTool.toolName, {
          bindings: [{ mouseButton: MouseBindings.Auxiliary }],
        });
        toolGroup.setToolActive(ZoomTool.toolName, {
          bindings: [{ mouseButton: MouseBindings.Secondary }],
        });
      }

      const image = await imageLoader.loadAndCacheImage(`wadouri:${fileUrl}`);
      console.log("ovde sam", image);

      const renderingEngine = new RenderingEngine(renderEngineId);
      const viewportId = "CT_STACK";
      // const element = document.querySelector("#dicomElement") as HTMLDivElement; // Reference to the div element

      if (dicomElementRef.current) {
        renderingEngine.enableElement({
          viewportId,
          type: ViewportType.STACK,
          element: dicomElementRef.current,
        });
      }

      toolGroup?.addViewport(viewportId, renderEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId,
      ) as Types.IStackViewport;

      void viewport.setStack([`wadouri:${fileUrl}`]);
      viewport.render();
    }

    void initializeViewer();

    // Clean-up function
    return () => {
      ToolGroupManager.destroyToolGroup(toolGroupId);
    };
  }, []);

  return (
    <div>
      <div ref={dicomElementRef} style={{ width: "500px", height: "500px" }} />
      {/* <p>Left Click to use selected tool</p> */}
    </div>
  );
};

export default CornerstoneViewer;
