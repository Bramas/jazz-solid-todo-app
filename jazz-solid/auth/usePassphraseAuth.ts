import { createSignal, createEffect, createMemo } from "solid-js";
import { Account, ID, PassphraseAuth } from "jazz-tools";
import { useAuthStorage } from "../hooks";
import { useIsAuthenticated } from "./useIsAuthenticated";
import { useJazzContext } from "../contextProvider";

export type PassphraseAuthHook = {
  current: PassphraseAuth;
  state: () => "anonymous" | "signedIn";
  passphrase: () => string | undefined;
  logIn: (passphrase: string) => Promise<void>;
  signUp: () => Promise<string>;
  registerNewAccount: (passphrase:string, name: string) => Promise<ID<Account>>;
  generateRandomPassphrase: () => string;
};

export function usePassphraseAuth({
  wordlist,
}: {
  wordlist: string[];
}): PassphraseAuthHook {
  const ctx = useJazzContext();

  if ("guest" in ctx())
    throw new Error("Passphrase auth is not supported in guest mode");

  const storage = useAuthStorage();
  const auth = createMemo(
    () =>
      new PassphraseAuth(
        ctx().node.crypto,
        ctx().authenticate,
        ctx().register,
        storage,
        wordlist
      )
  );

  const [passphrase, setPassphrase] = createSignal<string | undefined>(
    undefined
  );

  createEffect(() => {
    const instance = auth();
    instance.loadCurrentAccountPassphrase();
    const unsub = instance.subscribe(() => {
      return setPassphrase(instance.passphrase);
    });
    return unsub;
  });

  const isAuth = useIsAuthenticated();
  const state = () => (isAuth() ? "signedIn" : "anonymous");

  return {
    current: auth(),
    state,
    passphrase,
    logIn: auth().logIn.bind(auth()),
    signUp: auth().signUp.bind(auth()),
    registerNewAccount: auth().registerNewAccount.bind(auth()),
    generateRandomPassphrase: auth().generateRandomPassphrase.bind(auth()),
  };
}
