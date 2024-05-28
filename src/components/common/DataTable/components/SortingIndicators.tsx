import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React from "react";

const svgOptions = {
  width: 16,
  height: 16,
};

const lookupSort = {
  asc: <ArrowUp {...svgOptions} className="stroke-step-light-green" />,
  desc: <ArrowDown {...svgOptions} className="stroke-step-light-green" />,
};

type Props = { sort: "asc" | "desc" | false };

/**
 * Displays sorting indicators based on the provided sort direction.
 */
const SortingIndicators = ({ sort }: Props) => {
  return sort ? lookupSort[sort] : <ArrowUpDown {...svgOptions} />;
};

export default SortingIndicators;
