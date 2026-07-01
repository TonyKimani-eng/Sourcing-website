"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type AuthMode = "signin" | "signup";

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  openAuth: (mode?: AuthMode) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "teekay-auth-user";

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth components must be used inside AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedUser = window.localStorage.getItem(storageKey);

    if (savedUser) {
      setUser(JSON.parse(savedUser) as User);
    }
  }, []);

  const openAuth = (nextMode: AuthMode = "signin") => {
    setMode(nextMode);
    setIsOpen(true);
  };

  const signOut = () => {
    window.localStorage.removeItem(storageKey);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      openAuth,
      signOut
    }),
    [user]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim() || email.split("@")[0] || "Customer";

    if (!email) {
      return;
    }

    const nextUser = { name, email };
    window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
    setUser(nextUser);
    setIsOpen(false);
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
          onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black leading-none text-navy-950 transition hover:bg-ember-500 hover:text-white"
                aria-label="Close sign in dialog"
              >
                x
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              {mode === "signup" ? (
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
              <label className="grid gap-2">
                <span className="text-sm font-black text-navy-950">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  className="min-h-12 rounded-lg border border-slate-200 px-4 font-bold text-navy-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  placeholder="Minimum 6 characters"
                />
              </label>
              <button
                type="submit"
                className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-ember-500 px-5 text-sm font-black text-white transition hover:bg-navy-950"
              >
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm font-bold text-slate-600">
              {mode === "signin" ? "New to Teekay?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
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
