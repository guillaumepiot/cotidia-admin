export const curry = (func, ...outerArgs) => (...innerArgs) => func(...outerArgs, ...innerArgs)
