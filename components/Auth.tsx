"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { createPortal } from "react-dom";
import {
  onAuthStateChanged,
  PhoneAuthProvider,
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithCredential,
  signOut as firebaseSignOut,
  updateProfile,
  verifyBeforeUpdateEmail
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  InquiryInput,
  SavedInquiry,
  saveInquiry,
  subscribeToUserInquiries,
} from "@/lib/inquiries";
import { siteContent } from "@/data/site";
import { isAdminPhone } from "@/lib/admin";
import { routePath } from "@/data/paths";

type AuthMode = "signin" | "signup";
type AuthStep = "phone" | "code" | "profile";
type CheckoutStep = "cart" | "payment" | "submitted";

const manualPaymentName = siteContent.brand.paymentName;
const manualPaymentPhone = siteContent.brand.phone;

type User = {
  uid: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
};

type AuthContextValue = {
  user: User | null;
  openAuth: (mode?: AuthMode) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export type CartItem = {
  id: string;
  productName: string;
  storage: string;
  color: string;
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getAuthErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    const messages: Record<string, string> = {
      "auth/api-key-not-valid": "Firebase API key is not valid. Check NEXT_PUBLIC_FIREBASE_API_KEY.",
      "auth/app-not-authorized": "This website domain is not authorized in Firebase Authentication.",
      "auth/billing-not-enabled": "Phone OTP needs Firebase billing enabled, or use a Firebase test phone number.",
      "auth/configuration-not-found": "Firebase Authentication is not enabled for this project.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-phone-number": "Enter the phone number in international format, for example +254712345678.",
      "auth/invalid-verification-code": "The OTP code is incorrect. Please check it and try again.",
      "auth/missing-verification-code": "Enter the OTP code sent to your phone.",
      "auth/network-request-failed": "Could not reach Firebase. Check your internet connection.",
      "auth/operation-not-allowed": "Phone sign-in is not enabled in Firebase. Enable Phone under Authentication > Sign-in method.",
      "auth/quota-exceeded": "SMS limit reached. Please try again later.",
      "auth/requires-recent-login": "Please sign in again before updating this account.",
      "auth/requests-from-referer-are-blocked": "This website domain is blocked by the Firebase API key settings.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/user-disabled": "This account has been disabled."
    };

    return messages[error.code] ?? `Authentication failed (${error.code}). Please try again.`;
  }

  return "Authentication failed. Please try again.";
}

function isValidPhone(value: string) {
  return value.startsWith("+") && value.replace(/\D/g, "").length >= 8;
}

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth components must be used inside AuthProvider");
  }

  return context;
}

export function useAuth() {
  return useAuthContext();
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Cart components must be used inside AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [step, setStep] = useState<AuthStep>("phone");
  const [verificationId, setVerificationId] = useState("");
  const [phoneForVerification, setPhoneForVerification] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              name:
                firebaseUser.displayName ??
                firebaseUser.phoneNumber ??
                firebaseUser.email?.split("@")[0] ??
                "Customer",
              email: firebaseUser.email ?? "",
              emailVerified: firebaseUser.emailVerified,
              phone: firebaseUser.phoneNumber ?? ""
            }
          : null
      );
    });
  }, []);

  const resetAuthForm = useCallback(() => {
    setStep("phone");
    setVerificationId("");
    setPhoneForVerification("");
    setErrorMessage("");
    setIsSubmitting(false);
  }, []);

  const openAuth = useCallback((nextMode: AuthMode = "signin") => {
    setMode(nextMode);
    resetAuthForm();
    setIsOpen(true);
  }, [resetAuthForm]);

  const closeAuth = useCallback(async () => {
    if (step === "profile" && auth?.currentUser && !auth.currentUser.displayName) {
      await firebaseSignOut(auth);
    }

    resetAuthForm();
    setIsOpen(false);
  }, [resetAuthForm, step]);

  const signOut = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      openAuth,
      signOut
    }),
    [openAuth, signOut, user]
  );

  const cartValue = useMemo<CartContextValue>(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return {
      items: cartItems,
      itemCount,
      total,
      addItem: (item) => {
        const id = `${item.productName}__${item.storage}__${item.color}`;

        setCartItems((currentItems) => {
          const existingItem = currentItems.find((currentItem) => currentItem.id === id);

          if (existingItem) {
            return currentItems.map((currentItem) =>
              currentItem.id === id
                ? { ...currentItem, quantity: currentItem.quantity + item.quantity }
                : currentItem
            );
          }

          return [...currentItems, { ...item, id }];
        });
      },
      updateQuantity: (id, quantity) => {
        setCartItems((currentItems) =>
          currentItems
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (id) => {
        setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
      },
      clearCart: () => setCartItems([])
    };
  }, [cartItems]);

  const sendPhoneCode = async (phone: string) => {
    if (!auth) {
      setErrorMessage("Firebase is not configured yet. Add your Firebase env vars first.");
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMessage("Enter the phone number in international format, for example +254712345678.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const verifier = new RecaptchaVerifier(auth, "auth-recaptcha", {
        size: "invisible"
      });
      const phoneProvider = new PhoneAuthProvider(auth);
      const nextVerificationId = await phoneProvider.verifyPhoneNumber(phone, verifier);

      setVerificationId(nextVerificationId);
      setPhoneForVerification(phone);
      setStep("code");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyPhoneCode = async (otp: string) => {
    if (!auth || !verificationId) {
      setErrorMessage("Start again so we can verify your phone number.");
      return;
    }

    if (!otp) {
      setErrorMessage("Enter the OTP code sent to your phone.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);

      if (!result.user.displayName) {
        setStep("profile");
        return;
      }

      resetAuthForm();
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeProfile = async (name: string, email: string) => {
    if (!auth?.currentUser) {
      setErrorMessage("Sign in again before completing your profile.");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Enter your full name.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const currentUser = auth.currentUser;
    const nextName = name.trim();
    const nextEmail = email.trim();

    try {
      await updateProfile(currentUser, { displayName: nextName });
      setUser({
        uid: currentUser.uid,
        name: nextName,
        email: currentUser.email ?? "",
        emailVerified: currentUser.emailVerified,
        phone: currentUser.phoneNumber ?? ""
      });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    if (nextEmail) {
      await verifyBeforeUpdateEmail(currentUser, nextEmail).catch(() => undefined);
    }

    try {
      setUser({
        uid: currentUser.uid,
        name: nextName,
        email: currentUser.email || "",
        emailVerified: currentUser.emailVerified,
        phone: currentUser.phoneNumber ?? ""
      });
      resetAuthForm();
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    const otp = String(formData.get("otp") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (step === "phone") {
      await sendPhoneCode(phone);
      return;
    }

    if (step === "code") {
      await verifyPhoneCode(otp);
      return;
    }

    await completeProfile(name, email);
  };

  const title = mode === "signin" ? "Sign in to purchase" : "Create account";
  const eyebrow = mode === "signin" ? "Welcome back" : "Phone verification";

  return (
    <AuthContext.Provider value={value}>
      <CartContext.Provider value={cartValue}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/75 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          onClick={closeAuth}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-teal-600">{eyebrow}</p>
                <h2 id="auth-title" className="mt-1 text-2xl font-black text-navy-950">
                  {step === "profile" ? "Complete your account" : title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeAuth}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black leading-none text-navy-950 transition hover:bg-ember-500 hover:text-white"
                aria-label="Close sign in dialog"
              >
                x
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              {!isFirebaseConfigured ? (
                <div className="rounded-lg border border-ember-500/30 bg-ember-500/10 p-3 text-sm font-bold leading-6 text-ember-600">
                  Firebase is not configured yet. Add your Firebase project values to the
                  environment before using real sign in.
                </div>
              ) : null}
              {errorMessage ? (
                <div className="rounded-lg border border-ember-500/30 bg-ember-500/10 p-3 text-sm font-bold leading-6 text-ember-600">
                  {errorMessage}
                </div>
              ) : null}

              {step === "phone" ? (
                <label className="grid gap-2">
                  <span className="text-sm font-black text-navy-950">Phone number</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="+254712345678"
                  />
                </label>
              ) : null}

              {step === "code" ? (
                <>
                  <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-sm font-bold leading-6 text-teal-700">
                    We sent a verification code to {phoneForVerification}. Enter it to continue.
                  </div>
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">Verification code</span>
                    <input
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      placeholder="6-digit code"
                    />
                  </label>
                </>
              ) : null}

              {step === "profile" ? (
                <>
                  <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-sm font-bold leading-6 text-teal-700">
                    Phone verified. Add your name, and optionally add an email address.
                  </div>
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">Full name</span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">Email address optional</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      placeholder="Email is optional"
                    />
                  </label>
                </>
              ) : null}

              <div id="auth-recaptcha" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Please wait..."
                  : step === "phone"
                    ? "Continue"
                    : step === "code"
                      ? "Verify"
                      : "Finish"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm font-bold text-slate-600">
              {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  resetAuthForm();
                }}
                className="font-black text-teal-600 underline decoration-teal-500 decoration-2 underline-offset-4"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export function AuthButtons({ compact = false }: { compact?: boolean }) {
  const { user, openAuth, signOut } = useAuthContext();
  const { itemCount } = useCart();
  const [accountOwnerId, setAccountOwnerId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isAccountOpen = Boolean(user && accountOwnerId === user.uid);

  if (user) {
    return (
      <div className="relative flex min-w-0 items-center gap-2">
        {isAdminPhone(user.phone) ? (
          <a
            href={routePath("/admin")}
            className="inline-flex min-h-10 min-w-0 shrink-0 items-center rounded-full bg-gold-400 px-3 text-xs font-black text-navy-950 transition hover:bg-white sm:px-4"
          >
            Admin
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="inline-flex min-h-10 min-w-0 shrink-0 items-center rounded-full border border-white/20 px-3 text-xs font-black text-white transition hover:border-gold-400 hover:text-gold-400 sm:px-4"
          aria-haspopup="dialog"
          aria-expanded={isCartOpen}
        >
          Cart{itemCount ? ` (${itemCount})` : ""}
        </button>
        <button
          type="button"
          onClick={() => setAccountOwnerId(user.uid)}
          className="inline-flex min-h-10 min-w-0 shrink-0 items-center gap-2 rounded-full border border-white/20 px-3 text-xs font-black text-white transition hover:border-gold-400 hover:text-gold-400 sm:px-4"
          aria-haspopup="dialog"
          aria-expanded={isAccountOpen}
        >
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400 text-[10px] text-navy-950">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className={compact ? "hidden sm:inline" : "inline"}>Account</span>
        </button>
        {isAccountOpen ? (
          <AccountPanel
            user={user}
            onClose={() => setAccountOwnerId(null)}
            onSignOut={async () => {
              setAccountOwnerId(null);
              await signOut();
            }}
          />
        ) : null}
        {isCartOpen ? <CartPanel onClose={() => setIsCartOpen(false)} /> : null}
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 px-3 text-xs font-black text-white transition hover:border-gold-400 hover:text-gold-400 sm:px-4"
      >
        Cart{itemCount ? ` (${itemCount})` : ""}
      </button>
      <button
        type="button"
        onClick={() => openAuth("signin")}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 px-3 text-xs font-black text-white transition hover:border-gold-400 hover:text-gold-400 sm:px-4"
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => openAuth("signup")}
        className={`inline-flex min-h-10 items-center justify-center rounded-full bg-gold-400 px-3 text-xs font-black text-navy-950 transition hover:bg-white sm:px-4 ${
          compact ? "hidden sm:inline-flex" : ""
        }`}
      >
        Sign up
      </button>
      {isCartOpen ? <CartPanel onClose={() => setIsCartOpen(false)} /> : null}
    </div>
  );
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const { user, openAuth } = useAuthContext();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [paymentCode, setPaymentCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (typeof document === "undefined") {
    return null;
  }

  const paymentNote =
    "Customer submitted a manual M-Pesa payment code. Confirm the payment, then set the status to Paid.";

  const beginCheckout = () => {
    if (!items.length) {
      return;
    }

    if (!user?.phone) {
      onClose();
      openAuth("signin");
      return;
    }

    setErrorMessage("");
    setCheckoutStep("payment");
  };

  const submitPayment = async () => {
    const nextPaymentCode = paymentCode.trim();

    if (!items.length) {
      setCheckoutStep("cart");
      return;
    }

    if (!nextPaymentCode) {
      setErrorMessage("Paste the M-Pesa payment code before clicking I paid.");
      return;
    }

    if (!user?.phone) {
      onClose();
      openAuth("signin");
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage("");

    try {
      await saveInquiry(
        {
          productName: "iPhone cart order",
          productCategory: "iPhones",
          priceEstimate: total,
          quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          paymentMethod: "Manual M-Pesa",
          paymentStatus: "Payment submitted - awaiting admin confirmation",
          paymentNote,
          paymentCode: nextPaymentCode,
          orderItems: items.map((item) => ({
            productName: item.productName,
            storage: item.storage,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity
          }))
        },
        {
          userId: user.uid,
          customerName: user.name,
          customerPhone: user.phone,
          customerEmail: user.email
        }
      );
      clearCart();
      setCheckoutStep("submitted");
    } catch (error) {
      console.error("Could not save cart inquiry", error);
      setErrorMessage("Could not submit payment details. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-navy-950/75 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={onClose}
    >
      <div
        className="mx-auto my-0 w-full max-w-lg rounded-lg bg-white p-5 shadow-soft sm:my-8 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-teal-600">iPhone order</p>
            <h2 id="cart-title" className="mt-1 text-2xl font-black text-navy-950">
              {checkoutStep === "submitted" ? "Waiting confirmation" : checkoutStep === "payment" ? "Manual payment" : "Cart"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black leading-none text-navy-950 transition hover:bg-ember-500 hover:text-white"
            aria-label="Close cart"
          >
            x
          </button>
        </div>

        {checkoutStep === "submitted" ? (
          <div className="mt-6 grid gap-4">
            <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
              <p className="text-lg font-black text-teal-700">Waiting confirmation</p>
              <p className="mt-2 text-sm font-bold leading-6 text-teal-800">
                Your order and payment code were sent to Teekay admin. Once payment is confirmed, your account will show Order received. We will notify you when your item reaches the Nairobi pick-up station.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-navy-950 px-5 text-sm font-black text-white transition hover:bg-ember-500"
            >
              Close
            </button>
          </div>
        ) : null}

        {checkoutStep !== "submitted" ? (
        <div className="mt-6 grid gap-3">
          {items.length ? (
            items.map((item) => (
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-[#f8fbff] p-3" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-navy-950">{item.productName}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {item.storage} / {item.color}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs font-black text-ember-500 underline decoration-ember-500 decoration-2 underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center text-lg font-black text-navy-950 transition hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="inline-flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-3 text-sm font-black text-navy-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center text-lg font-black text-navy-950 transition hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500">{formatKes(item.unitPrice)} each</p>
                    <p className="text-sm font-black text-navy-950">
                      {formatKes(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">
              Your cart is empty.
            </span>
          )}
        </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 rounded-md bg-ember-500/10 px-3 py-2 text-sm font-black text-ember-600">
            {errorMessage}
          </p>
        ) : null}

        {checkoutStep === "payment" && items.length ? (
          <div className="mt-5 grid gap-4 rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">Send M-Pesa to</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-md bg-white px-3 py-2">
                  <p className="text-xs font-bold text-slate-500">Name</p>
                  <p className="text-sm font-black text-navy-950">{manualPaymentName}</p>
                </div>
                <div className="rounded-md bg-white px-3 py-2">
                  <p className="text-xs font-bold text-slate-500">Mobile number</p>
                  <p className="text-sm font-black text-navy-950">{manualPaymentPhone}</p>
                </div>
              </div>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-black text-navy-950">M-Pesa payment code</span>
              <input
                value={paymentCode}
                onChange={(event) => {
                  setPaymentCode(event.target.value.toUpperCase());
                  setErrorMessage("");
                }}
                className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold uppercase text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                placeholder="Paste payment code"
              />
            </label>
          </div>
        ) : null}

        {checkoutStep !== "submitted" ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-black uppercase text-slate-500">Total</span>
            <span className="text-2xl font-black text-ember-500">{formatKes(total)}</span>
          </div>
          {checkoutStep === "payment" ? (
            <button
              type="button"
              onClick={() => void submitPayment()}
              disabled={!items.length || isCheckingOut}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? "Submitting..." : "I paid"}
            </button>
          ) : (
          <button
            type="button"
            onClick={beginCheckout}
            disabled={!items.length || isCheckingOut}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut ? "Placing order..." : user?.phone ? "Place order - manual M-Pesa" : "Sign in to checkout"}
          </button>
          )}
          <p className="mt-3 rounded-md bg-teal-500/10 px-3 py-2 text-xs font-bold leading-5 text-teal-700">
            Payment is checked manually. Your account updates after admin confirms the payment.
          </p>
        </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

function AccountPanel({
  user,
  onClose,
  onSignOut
}: {
  user: User;
  onClose: () => void;
  onSignOut: () => Promise<void>;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-navy-950/75 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-title"
      onClick={onClose}
    >
      <div
        className="mx-auto my-0 w-full max-w-md rounded-lg bg-white p-5 shadow-soft sm:my-8 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-teal-600">Account</p>
            <h2 id="account-title" className="mt-1 truncate text-2xl font-black text-navy-950">
              {user.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black leading-none text-navy-950 transition hover:bg-ember-500 hover:text-white"
            aria-label="Close account panel"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <AccountDetail label="Phone" value={user.phone || "Not available"} />
          <AccountDetail
            label="Phone status"
            value={user.phone ? "Verified by OTP" : "Not verified"}
            tone={user.phone ? "success" : "warning"}
          />
          <EmailAccountAction user={user} />
          <CustomerOrders userId={user.uid} />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-black text-navy-950 transition hover:border-teal-500 hover:text-teal-600"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
          >
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatKes(value: number) {
  return `KSh ${Math.round(value).toLocaleString("en-KE")}`;
}

function getCustomerOrderStatus(inquiry: SavedInquiry) {
  if (inquiry.requestType === "sourcing") {
    if (inquiry.paymentStatus?.toLowerCase().includes("payment submitted")) {
      return "Waiting payment confirmation";
    }

    if (inquiry.status === "Paid") {
      return "Payment confirmed - awaiting review";
    }

    return inquiry.status;
  }

  if (inquiry.status === "Paid") {
    return "Order received";
  }

  if (inquiry.paymentStatus?.toLowerCase().includes("payment submitted")) {
    return "Waiting confirmation";
  }

  return inquiry.status;
}

function CustomerOrders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<SavedInquiry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    return subscribeToUserInquiries(
      userId,
      (nextOrders) => {
        setOrders(nextOrders);
        setLoadState("ready");
      },
      () => setLoadState("error")
    );
  }, [userId]);

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 p-3">
      <span className="text-xs font-black uppercase text-slate-500">Orders</span>
      <p className="rounded-md bg-teal-500/10 px-3 py-2 text-xs font-bold leading-5 text-teal-700">
        We will notify you when your item reaches the Nairobi pick-up station.
      </p>
      {loadState === "loading" ? (
        <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">
          Loading orders...
        </span>
      ) : null}
      {loadState === "error" ? (
        <span className="rounded-md bg-ember-500/10 px-3 py-2 text-sm font-black text-ember-600">
          Could not load orders.
        </span>
      ) : null}
      {loadState === "ready" && !orders.length ? (
        <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">
          No orders yet.
        </span>
      ) : null}
      {orders.slice(0, 5).map((order) => (
        <div className="grid gap-2 rounded-md bg-[#f8fbff] p-3" key={order.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-navy-950">{order.productName}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{order.createdAtText}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                order.status === "Paid"
                  ? "bg-teal-500/10 text-teal-700"
                  : "bg-gold-400/20 text-navy-950"
              }`}
            >
              {getCustomerOrderStatus(order)}
            </span>
          </div>
          {order.priceEstimate ? (
            <p className="text-sm font-black text-ember-500">{formatKes(order.priceEstimate)}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EmailAccountAction({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(!user.email);
  const [emailValue, setEmailValue] = useState(user.email);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const saveEmail = async () => {
    const nextEmail = emailValue.trim();

    if (!auth?.currentUser || !nextEmail) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setVerifyStatus("idle");

    try {
      await verifyBeforeUpdateEmail(auth.currentUser, nextEmail);
      setSaveStatus("saved");
      setVerifyStatus("sent");
      setIsEditing(false);
    } catch {
      setSaveStatus("error");
    }
  };

  const sendVerification = async () => {
    if (!auth?.currentUser) {
      setVerifyStatus("error");
      return;
    }

    setVerifyStatus("sending");

    try {
      await sendEmailVerification(auth.currentUser);
      setVerifyStatus("sent");
    } catch {
      setVerifyStatus("error");
    }
  };

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase text-slate-500">Email</span>
        {user.email ? (
          <button
            type="button"
            onClick={() => {
              setIsEditing((current) => !current);
              setSaveStatus("idle");
            }}
            className="text-xs font-black text-teal-600 underline decoration-teal-500 decoration-2 underline-offset-4 transition hover:text-navy-950"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="grid gap-2">
          <input
            type="email"
            value={emailValue}
            onChange={(event) => {
              setEmailValue(event.target.value);
              setSaveStatus("idle");
            }}
            className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            placeholder="Email is optional"
          />
          <button
            type="button"
            onClick={() => void saveEmail()}
            disabled={saveStatus === "saving"}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-navy-950 px-4 text-xs font-black text-white transition hover:bg-ember-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveStatus === "saving" ? "Saving..." : user.email ? "Save email" : "Add email"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="min-h-10 min-w-0 flex-1 truncate rounded-md bg-slate-100 px-3 py-2 text-sm font-black leading-6 text-slate-700">
            {user.email || "Not added"}
          </span>
          {user.email && !user.emailVerified ? (
            <button
              type="button"
              onClick={() => void sendVerification()}
              disabled={verifyStatus === "sending" || verifyStatus === "sent"}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-slate-200 px-4 text-xs font-black text-navy-950 transition hover:border-teal-500 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyStatus === "sending" ? "Sending..." : verifyStatus === "sent" ? "Email sent" : "Verify email"}
            </button>
          ) : null}
        </div>
      )}

      {user.email ? (
        <span
          className={`rounded-md px-3 py-2 text-sm font-black leading-5 ${
            user.emailVerified ? "bg-teal-500/10 text-teal-700" : "bg-ember-500/10 text-ember-600"
          }`}
        >
          {user.emailVerified ? "Email verified" : "Email not verified"}
        </span>
      ) : null}

      {!user.email && !isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-xs font-black text-navy-950 transition hover:border-teal-500 hover:text-teal-600"
          >
          Add email
        </button>
      ) : null}

      {saveStatus === "saved" || verifyStatus === "sent" ? (
        <span className="text-xs font-bold text-teal-700">Check your email, then sign in again.</span>
      ) : null}
      {saveStatus === "error" ? (
        <span className="text-xs font-bold text-ember-600">Could not send email verification. Try signing in again.</span>
      ) : null}
      {verifyStatus === "error" ? (
        <span className="text-xs font-bold text-ember-600">Could not send verification email. Try again.</span>
      ) : null}
    </div>
  );
}

function AccountDetail({
  label,
  value,
  tone = "muted"
}: {
  label: string;
  value: string;
  tone?: "muted" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "bg-teal-500/10 text-teal-700"
      : tone === "warning"
        ? "bg-ember-500/10 text-ember-600"
        : "bg-slate-100 text-slate-700";

  return (
    <div className="grid gap-1 rounded-lg border border-slate-200 p-3">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <span className={`min-h-8 rounded-md px-3 py-2 text-sm font-black leading-5 ${toneClass}`}>
        {value}
      </span>
    </div>
  );
}

export function PurchaseLink({
  href,
  children,
  className,
  inquiry
}: {
  href: string;
  children: ReactNode;
  className: string;
  inquiry?: InquiryInput;
}) {
  const { user, openAuth } = useAuthContext();

  if (user?.phone) {
    if (!inquiry) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={async () => {
          try {
            await saveInquiry(inquiry, {
              userId: user.uid,
              customerName: user.name,
              customerPhone: user.phone,
              customerEmail: user.email
            });
          } catch (error) {
            console.error("Could not save inquiry", error);
          } finally {
            window.location.href = href;
          }
        }}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <button type="button" onClick={() => openAuth("signin")} className={className}>
      {children}
    </button>
  );
}
