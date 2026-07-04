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
import {
  createUserWithEmailAndPassword,
  deleteUser,
  linkWithCredential,
  onAuthStateChanged,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type AuthMode = "signin" | "signup";
type SignupStep = "details" | "phone-code";
type PendingSignup = {
  email: string;
  name: string;
  password: string;
  phone: string;
};

type User = {
  name: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  user: User | null;
  openAuth: (mode?: AuthMode) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthErrorMessage(error: unknown, context: "email" | "phone" = "email") {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    const messages: Record<string, string> = {
      "auth/email-already-in-use": "That email already has an account. Please sign in instead.",
      "auth/api-key-not-valid": "Firebase API key is not valid. Check NEXT_PUBLIC_FIREBASE_API_KEY.",
      "auth/app-not-authorized": "This website domain is not authorized in Firebase Authentication.",
      "auth/configuration-not-found": "Firebase Authentication is not enabled for this project.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/network-request-failed": "Could not reach Firebase. Check your internet connection.",
      "auth/operation-not-allowed":
        context === "phone"
          ? "Phone sign-in is not enabled in Firebase. Enable Phone under Authentication > Sign-in method."
          : "Email/password auth is not enabled in Firebase.",
      "auth/provider-already-linked": "That phone number is already linked to this account.",
      "auth/invalid-phone-number": "Enter the phone number in international format, for example +254712345678.",
      "auth/invalid-verification-code": "The OTP code is incorrect. Please check it and try again.",
      "auth/missing-verification-code": "Enter the OTP code sent to your phone.",
      "auth/quota-exceeded": "SMS limit reached. Please try again later.",
      "auth/requests-from-referer-are-blocked": "This website domain is blocked by the Firebase API key settings.",
      "auth/requires-recent-login": "Please sign in again before verifying this phone number.",
      "auth/second-factor-already-in-use": "That phone number is already used by another account.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account exists for that email.",
      "auth/weak-password": "Use a password with at least 6 characters.",
      "auth/wrong-password": "Email or password is incorrect."
    };

    return messages[error.code] ?? `Authentication failed (${error.code}). Please try again.`;
  }

  return "Authentication failed. Please try again.";
}

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth components must be used inside AuthProvider");
  }

  return context;
}

function PasswordVisibilityIcon({ isVisible }: { isVisible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {isVisible ? <path d="M4 20 20 4" /> : null}
    </svg>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signupStep, setSignupStep] = useState<SignupStep>("details");
  const [verificationId, setVerificationId] = useState("");
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null);
  const [phoneForVerification, setPhoneForVerification] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
              name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Customer",
              email: firebaseUser.email ?? "",
              phone: firebaseUser.phoneNumber ?? ""
            }
          : null
      );
    });
  }, []);

  const resetAuthForm = useCallback(() => {
    setSignupStep("details");
    setVerificationId("");
    setPendingSignup(null);
    setPhoneForVerification("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage("");
    setIsSubmitting(false);
  }, []);

  const openAuth = useCallback((nextMode: AuthMode = "signin") => {
    setMode(nextMode);
    resetAuthForm();
    setIsOpen(true);
  }, [resetAuthForm]);

  const closeAuth = useCallback(async () => {
    resetAuthForm();
    setIsOpen(false);
  }, [resetAuthForm]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setErrorMessage("Firebase is not configured yet. Add your Firebase env vars first.");
      return;
    }

    const activeAuth = auth;
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim() || email.split("@")[0] || "Customer";
    const phone = String(formData.get("phone") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const otp = String(formData.get("otp") ?? "").trim();

    if (mode === "signup" && signupStep === "phone-code") {
      if (!pendingSignup || !verificationId) {
        setErrorMessage("Start signup again so we can verify your phone number.");
        return;
      }

      if (!otp) {
        setErrorMessage("Enter the OTP code sent to your phone.");
        return;
      }

      setIsSubmitting(true);
      setErrorMessage("");

      try {
        const phoneCredential = PhoneAuthProvider.credential(verificationId, otp);
        const userCredential = await createUserWithEmailAndPassword(
          activeAuth,
          pendingSignup.email,
          pendingSignup.password
        );
        await updateProfile(userCredential.user, { displayName: pendingSignup.name });
        await linkWithCredential(userCredential.user, phoneCredential);
        resetAuthForm();
        setIsOpen(false);
      } catch (error) {
        if (activeAuth.currentUser && !activeAuth.currentUser.phoneNumber) {
          await deleteUser(activeAuth.currentUser).catch(async () => {
            await firebaseSignOut(activeAuth);
          });
        }
        setErrorMessage(getAuthErrorMessage(error, "phone"));
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (!email) {
      return;
    }

    if (mode === "signup") {
      if (!phone) {
        setErrorMessage("Enter a phone number so we can send the OTP.");
        return;
      }

      if (!phone.startsWith("+")) {
        setErrorMessage("Enter the phone number in international format, for example +254712345678.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("The two passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (mode === "signup") {
        const verifier = new RecaptchaVerifier(activeAuth, "signup-recaptcha", {
          size: "invisible"
        });
        const phoneProvider = new PhoneAuthProvider(activeAuth);
        const nextVerificationId = await phoneProvider.verifyPhoneNumber(phone, verifier);

        setVerificationId(nextVerificationId);
        setPendingSignup({ email, name, password, phone });
        setPhoneForVerification(phone);
        setSignupStep("phone-code");
      } else {
        await signInWithEmailAndPassword(activeAuth, email, password);
        setIsOpen(false);
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, mode === "signup" ? "phone" : "email"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/75 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          onClick={() => void closeAuth()}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-teal-600">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </p>
                <h2 id="auth-title" className="mt-1 text-2xl font-black text-navy-950">
                  {mode === "signin" ? "Sign in to purchase" : "Sign up to purchase"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => void closeAuth()}
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
              {mode === "signup" && signupStep === "phone-code" ? (
                <>
                  <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-sm font-bold leading-6 text-teal-700">
                    We sent an OTP to {phoneForVerification}. Enter it to verify your phone number.
                  </div>
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">OTP code</span>
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
              {mode === "signup" && signupStep === "details" ? (
                <label className="grid gap-2">
                  <span className="text-sm font-black text-navy-950">Full name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="Your name"
                  />
                </label>
              ) : null}
              {signupStep === "details" ? (
                <>
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">Email address</span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      placeholder="you@example.com"
                    />
                  </label>
                  {mode === "signup" ? (
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
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-navy-950">Password</span>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        minLength={6}
                        className="min-h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((isVisible) => !isVisible)}
                        className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 transition hover:text-teal-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <PasswordVisibilityIcon isVisible={showPassword} />
                      </button>
                    </div>
                  </label>
                  {mode === "signup" ? (
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-navy-950">Confirm password</span>
                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          autoComplete="new-password"
                          minLength={6}
                          className="min-h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
                          className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 transition hover:text-teal-600"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          <PasswordVisibilityIcon isVisible={showConfirmPassword} />
                        </button>
                      </div>
                    </label>
                  ) : null}
                </>
              ) : null}
              <div id="signup-recaptcha" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
              >
                {isSubmitting
                  ? "Please wait..."
                  : mode === "signin"
                    ? "Sign in"
                    : signupStep === "phone-code"
                      ? "Verify phone"
                      : "Create account"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm font-bold text-slate-600">
              {mode === "signin" ? "New to Teekay?" : "Already have an account?"}{" "}
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
    </AuthContext.Provider>
  );
}

export function AuthButtons({ compact = false }: { compact?: boolean }) {
  const { user, openAuth, signOut } = useAuthContext();

  if (user) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden max-w-28 truncate text-xs font-black text-white/80 sm:inline">
          {user.name}
        </span>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/20 px-3 text-xs font-black text-white transition hover:border-gold-400 hover:text-gold-400 sm:px-4"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
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
    </div>
  );
}

export function PurchaseLink({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className: string;
}) {
  const { user, openAuth } = useAuthContext();

  if (user) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => openAuth("signin")} className={className}>
      {children}
    </button>
  );
}
