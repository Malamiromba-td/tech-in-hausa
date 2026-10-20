import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { mergeMessages } from "./merge-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const targetMessages = (
    await import(`../../messages/${locale}.json`)
  ).default;

  const fallbackMessages = (
    await import("../../messages/en.json")
  ).default;

  return {
    locale,
    messages:
      locale === "en"
        ? targetMessages
        : mergeMessages(fallbackMessages, targetMessages),
  };
});
