"use client";

import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: number;
    }
  ) => void;
};

type GoogleNamespace = {
  accounts: {
    id: GoogleAccountsId;
  };
};

type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (credential: string) => void;
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const getGoogle = () =>
  (window as Window & { google?: GoogleNamespace }).google ?? null;

const loadGoogleScript = () =>
  new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (getGoogle()) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Không tải được Google SDK.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không tải được Google SDK."));

    document.head.appendChild(script);
  });

export function GoogleSignInButton({
  disabled = false,
  onCredential,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const envError = GOOGLE_CLIENT_ID
    ? null
    : "Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID trong môi trường.";

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || envError) {
      return;
    }

    let cancelled = false;

    const initGoogleButton = () => {
      const google = getGoogle();
      const container = containerRef.current;

      if (!google?.accounts?.id || !container) {
        setError("Google SDK chưa sẵn sàng.");
        return;
      }

      container.innerHTML = "";
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          const credential = response.credential;
          if (!credential || disabled) return;
          onCredential(credential);
        },
      });
      google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 340,
      });
      setError(null);
    };

    loadGoogleScript()
      .then(() => {
        if (!cancelled) {
          initGoogleButton();
        }
      })
      .catch((scriptError) => {
        if (!cancelled) {
          setError(
            scriptError instanceof Error
              ? scriptError.message
              : "Không tải được Google SDK."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [disabled, envError, onCredential]);

  return (
    <div className="space-y-2">
      <div className={disabled ? "pointer-events-none opacity-60" : undefined}>
        <div ref={containerRef} className="flex justify-center" />
      </div>
      {envError || error ? (
        <p className="text-xs text-rose-600">{envError ?? error}</p>
      ) : null}
    </div>
  );
}
