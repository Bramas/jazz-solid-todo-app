
import QRCode from "qrcode";

import { createInviteLink, useAccount } from "../jazz-solid"
import { CoValue } from "jazz-tools";
import { createSignal, Show } from "solid-js";

export function InviteButton<T extends CoValue>(props: {
  value?: T | null;
  valueHint?: string;
}) {
  const { me } = useAccount();
  const [ qr, setQr ] = createSignal(null);

  return (
    <Show 
        when={props.value && me().canAdmin(props.value)}
        >
      <Show
        when={qr()}
        fallback={
          <button
            style={{
              background: "#000",
              color: "#fff",
              padding: "13px 13px",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
            }}
            disabled={!props.value._owner || !props.value.id}
            variant="outline"
            onClick={async () => {
              let inviteLink = null;
              if (props.value._owner && props.value.id) {
                inviteLink = createInviteLink(props.value, "writer", {
                  valueHint: props.valueHint,
                });
              }
              if (inviteLink) {
                const qr = await QRCode.toDataURL(inviteLink, {
                  errorCorrectionLevel: "L",
                });
                navigator.clipboard.writeText(inviteLink).then(() => setQr(qr)
                );
              }
            }}
          >
            Invite
          </button>
        }
        > 
          <span>Copied invite link to clipboard</span>
          <img
            src={qr()}
            alt="QR Code"
            className="w-20 h-20" />
        </Show>
    </Show>
    )
}

