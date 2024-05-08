"use client";

import React, { useEffect, useRef } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

// Setup the necessary external libraries
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr: XMLHttpRequest) {
    // You can modify the XHR request here if necessary (e.g., setting headers)
  },
});

interface Props {
  fileUrl: string;
}

const DicomViewer = ({ fileUrl }: Props) => {
  const dicomImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dicomImageRef.current;
    if (!element) return;

    cornerstone.enable(element);

    const loadAndDisplayImage = async () => {
      try {
        const image = await cornerstone.loadImage(`wadouri:${fileUrl}`);
        cornerstone.displayImage(element, image);

        // Initialize and activate tools as needed
        cornerstoneTools.init();
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
      } catch (err) {
        console.error(err);
      }
    };

    loadAndDisplayImage();

    return () => {
      cornerstone.disable(element);
    };
  }, [fileUrl]);

  return (
    <div>
      <div
        ref={dicomImageRef}
        style={{ width: "512px", height: "512px" }}
      ></div>
    </div>
  );
};

export default DicomViewer;
