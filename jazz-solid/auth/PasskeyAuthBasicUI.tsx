import { Component, createSignal, JSX } from "solid-js";
import { Show } from "solid-js";
import { usePasskeyAuth } from "./usePasskeyAuth";

export interface PasskeyAuthBasicUIProps {
  appName: string;
  appHostname?: string;
  children?: JSX.Element;
}

export const PasskeyAuthBasicUI: Component<PasskeyAuthBasicUIProps> = (
  props
) => {
  const auth = usePasskeyAuth({
    appName: props.appName,
    appHostname: props.appHostname,
  });
  const [username, setUsername] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSignUp = async (e: Event) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.signUp(username());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogIn = async () => {
    setError(null);
    try {
      await auth.logIn();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Show when={auth.state() === "anonymous"} fallback={props.children}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        {error() && <div style={{ color: "red" }}>{error()}</div>}
        <div
          style={{
            width: "18rem",
            display: "flex",
            "flex-direction": "column",
            gap: "2rem",
          }}
        >
          <form
            onSubmit={handleSignUp}
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "0.5rem",
            }}
          >
            <input
              placeholder="Display name"
              value={username()}
              onInput={(e) =>
                setUsername((e.currentTarget as HTMLInputElement).value)
              }
              autocomplete="webauthn"
              style={{
                border: "2px solid #000",
                padding: "11px 8px",
                "border-radius": "6px",
              }}
            />
            <input
              type="submit"
              value="Sign up"
              style={{
                background: "#000",
                color: "#fff",
                padding: "13px 5px",
                border: "none",
                "border-radius": "6px",
                cursor: "pointer",
              }}
            />
          </form>
          <button
            onClick={handleLogIn}
            style={{
              background: "#000",
              color: "#fff",
              padding: "13px 5px",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
            }}
          >
            Log in with existing account
          </button>
        </div>
      </div>
    </Show>
  );
};
