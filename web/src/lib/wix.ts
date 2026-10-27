import { WIX_BASE_URL } from "@/config/site";

/** Build a link into the Wix back office (bookings, store, members, forms). */
export function wixUrl(path: string): string {
  return `${WIX_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every Wix-hosted destination the new site links to, in one place. */
export const wixLinks = {
  apply: wixUrl("/apply"),
  login: wixUrl("/account/my-account"),
  cart: wixUrl("/cart-page"),
  tourInPerson: wixUrl("/service-page/in-person-tour"),
  tourVirtual: wixUrl("/service-page/virtual-tour"),
  scholarshipForm: wixUrl("/scholarships"),
  waitlistForm: wixUrl("/waitlist"),
  instructorApplication: wixUrl("/nailinstructorposition"),
  graduationTickets: wixUrl("/product-page/adult-graduation-tickets"),
  store: wixUrl("/category/all-products"),
  service: (slug: string) => wixUrl(`/service-page/${slug}`),
  bookingCalendar: (slug: string) => wixUrl(`/booking-calendar/${slug}`),
} as const;
