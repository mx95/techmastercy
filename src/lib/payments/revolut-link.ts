import {
  findRevolutOffer,
  getRevolutOfferUrl,
  revolutDeferredPaymentMessage,
  type RevolutPaymentOffer,
} from "@/content/revolut-payment-offers";

export type RevolutLinkCartItem = {
  slug: string;
  quantity: number;
};

export type RevolutLinkResolution =
  | {
      mode: "instant";
      offer: RevolutPaymentOffer;
      redirectUrl: string;
      message: string;
    }
  | {
      mode: "deferred";
      offer: null;
      redirectUrl: null;
      message: string;
    }
  | {
      mode: "unconfigured";
      offer: RevolutPaymentOffer;
      redirectUrl: null;
      message: string;
    };

export function resolveRevolutLinkPayment(
  items: RevolutLinkCartItem[],
): RevolutLinkResolution {
  const offer = findRevolutOffer(items);
  if (!offer) {
    return {
      mode: "deferred",
      offer: null,
      redirectUrl: null,
      message: revolutDeferredPaymentMessage,
    };
  }

  const redirectUrl = getRevolutOfferUrl(offer);
  if (!redirectUrl) {
    return {
      mode: "unconfigured",
      offer,
      redirectUrl: null,
      message: `Payment link for “${offer.label}” is not configured yet. Set ${offer.urlEnv} on the server.`,
    };
  }

  return {
    mode: "instant",
    offer,
    redirectUrl,
    message: `Pay securely via Revolut for ${offer.label}.`,
  };
}
