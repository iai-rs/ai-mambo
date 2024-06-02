import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React from "react";

const svgOptions = {
  width: 16,
  height: 16,
};

const lookupSort = {
  asc: <ArrowUp {...svgOptions} className="stroke-blue-500" />,
  desc: <ArrowDown {...svgOptions} className="stroke-blue-500" />,
};

type Props = { sort: "asc" | "desc" | false };

/**
 * Displays sorting indicators based on the provided sort direction.
 */
const SortingIndicators = ({ sort }: Props) => {
  return sort ? lookupSort[sort] : <ArrowUpDown {...svgOptions} />;
};

export default SortingIndicators;
