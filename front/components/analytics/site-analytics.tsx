import { HubAnalytics } from "@/lib/hub-tracker/HubAnalytics";
import { locales } from "@/i18n/routing";
import { PATH_PATTERNS, PRIVATE_SEGMENTS } from "./hub-settings";

/**
 * Sends the group hub this site's page views and clicks. Independent from
 * `PageTracker`, which feeds this site's own admin.
 */
export function SiteAnalytics() {
  return <HubAnalytics locales={locales} privateSegments={PRIVATE_SEGMENTS} pathPatterns={PATH_PATTERNS} />;
}
