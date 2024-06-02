const modelResultFormatter = (value: number | null | undefined) => {
  return value ? Math.round(value * 100) + "%" : "-";
};

export { modelResultFormatter };
