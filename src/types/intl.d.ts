/**
 * Type definitions for next-intl
 * This provides type safety for translation keys
 */

type Messages = typeof import('../messages/en.json');

declare global {
    // Use type safe message keys with `next-intl`
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntlMessages extends Messages { }
}

export { };

