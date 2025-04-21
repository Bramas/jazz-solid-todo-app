import { createSignal, Show } from "solid-js";
import { PasskeyAuthBasicUI, PassphraseAuthBasicUI, useIsAuthenticated } from "../jazz-solid";
import { wordlist } from "./wordlist";


export default (props: { appName: string; children: any }) => {
    const isAuth = useIsAuthenticated();

    const [step, setStep] = createSignal('initial');

    return (
        <Show
            when={!isAuth()}
            fallback={props.children}
        >
            <Show when={step() === 'initial'}>
                <div style={{ "text-align": "center", "margin-top": "2rem" }}>
                    <h1 style={{ "font-size": "2rem", "margin-bottom": "1rem" }}>
                        {props.appName}
                    </h1>
                    <p style={{ "font-size": "1.2rem", "margin-bottom": "1rem" }}>
                        Welcome to {props.appName}!
                    </p>
                    <p style={{ "font-size": "1.2rem", "margin-bottom": "1rem" }}>
                        Please log in or create an account to continue.
                    </p>
                    <button
                        onClick={() => setStep('passkey')}
                        style={{
                            padding: "0.5rem 1rem",
                            background: "#f5f5f5",  
                            border: "1px solid #ccc",
                            "border-radius": "4px",
                            cursor: "pointer",
                            "font-size": "1rem",
                            "margin-right": "1rem",
                        }}
                    >
                        Log in with Passkey
                    </button>
                    <button
                        onClick={() => setStep('passphrase')}
                        style={{
                            padding: "0.5rem 1rem",
                            background: "#f5f5f5",
                            border: "1px solid #ccc",
                            "border-radius": "4px",
                            cursor: "pointer",
                            "font-size": "1rem",
                            "margin-left": "1rem",
                        }}
                    >
                        Log in with Passphrase
                    </button>
                </div>
            </Show>
            <Show when={step() === 'passkey'}>
                <PasskeyAuthBasicUI appName={props.appName}>
                </PasskeyAuthBasicUI>
            </Show>
            <Show when={step() === 'passphrase'}>
                <PassphraseAuthBasicUI appName={props.appName} wordlist={wordlist}></PassphraseAuthBasicUI>
            </Show>
        </Show>
    );
}