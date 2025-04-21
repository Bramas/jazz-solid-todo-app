import { Component, createEffect, createSignal, JSX, Show } from "solid-js";
import { usePassphraseAuth } from "./usePassphraseAuth";
import { useIsAuthenticated } from "./useIsAuthenticated";

export interface PassphraseAuthBasicUIProps {
  appName: string;
  wordlist: string[];
  children?: JSX.Element;
}

export const PassphraseAuthBasicUI: Component<PassphraseAuthBasicUIProps> = (
  props
) => {
  const auth = usePassphraseAuth({ wordlist: props.wordlist });
  const [step, setStep] = createSignal<"initial" | "create" | "login">(
    "initial"
  );
  const [loginPassphrase, setLoginPassphrase] = createSignal("");
  const [isCopied, setIsCopied] = createSignal(false);

  const handleCreate = () => setStep("create");
  const handleLogin = () => setStep("login");
  const handleBack = () => (
    setStep("initial"), setLoginPassphrase(""), setIsCopied(false)
  );
  const handleCopy = async () => {
    await navigator.clipboard.writeText(auth.passphrase() || "");
    setIsCopied(true);
  };
  const handleNext = async () => {
    await auth.signUp();
    setStep("initial");
    setLoginPassphrase("");
    setIsCopied(false);
  };
  const handleLoginSubmit = async () => {
    await auth.logIn(loginPassphrase());
    setStep("initial");
    setLoginPassphrase("");
  };

  return (
    <Show when={auth.state() !== "signedIn"} fallback={props.children}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        <div
          style={{
            width: "18rem",
            display: "flex",
            "flex-direction": "column",
            gap: "1.5rem",
          }}
        >
          {step() === "initial" && (
            <>
              <h1
                style={{
                  margin: 0,
                  "text-align": "center",
                  "font-size": "1.5rem",
                }}
              >
                {props.appName}
              </h1>
              <button
                onClick={handleCreate}
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "13px 5px",
                  border: "none",
                  "border-radius": "6px",
                  cursor: "pointer",
                }}
              >
                Create new account
              </button>
              <button
                onClick={handleLogin}
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "13px 5px",
                  border: "1px solid #000",
                  "border-radius": "6px",
                  cursor: "pointer",
                }}
              >
                Log in
              </button>
            </>
          )}

          {step() === "create" && (
            <>
              <h1
                style={{
                  margin: 0,
                  "text-align": "center",
                  "font-size": "1.25rem",
                }}
              >
                Your Passphrase
              </h1>
              <textarea
                readOnly
                value={auth.passphrase() || ""}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  "border-radius": "6px",
                  "box-sizing": "border-box",
                }}
                rows={5}
              />
              <div
                style={{
                  display: "flex",
                  "justify-content": "space-between",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={handleBack}
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "13px 5px",
                    border: "1px solid #000",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "13px 5px",
                    border: "none",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  {isCopied() ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "13px 5px",
                    border: "none",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  I have saved it!
                </button>
              </div>
            </>
          )}

          {step() === "login" && (
            <>
              <h1
                style={{
                  margin: 0,
                  "text-align": "center",
                  "font-size": "1.25rem",
                }}
              >
                Log In
              </h1>
              <textarea
                value={loginPassphrase()}
                onInput={(e) => setLoginPassphrase(e.currentTarget.value)}
                placeholder="Enter your passphrase"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  "border-radius": "6px",
                  "box-sizing": "border-box",
                }}
                rows={5}
              />
              <div
                style={{
                  display: "flex",
                  "justify-content": "space-between",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={handleBack}
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "13px 5px",
                    border: "1px solid #000",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleLoginSubmit}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "13px 5px",
                    border: "none",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  Log In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Show>
  );
};
