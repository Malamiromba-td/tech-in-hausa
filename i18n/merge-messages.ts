type Messages = {
  [key: string]: string | Messages | Messages[];
};

export function mergeMessages(
  fallback: Messages,
  target: Messages
): Messages {
  const result: Messages = { ...fallback };

  for (const key of Object.keys(target)) {
    const fallbackValue = fallback[key];
    const targetValue = target[key];

    if (
      targetValue &&
      fallbackValue &&
      typeof targetValue === "object" &&
      typeof fallbackValue === "object" &&
      !Array.isArray(targetValue) &&
      !Array.isArray(fallbackValue)
    ) {
      result[key] = mergeMessages(
        fallbackValue as Messages,
        targetValue as Messages
      );
    } else {
      result[key] = targetValue;
    }
  }

  return result;
    }
