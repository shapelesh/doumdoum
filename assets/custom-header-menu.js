import { Component } from "@theme/component";
import { trapFocus, removeTrapFocus } from "@theme/focus";
import {
  onAnimationEnd,
  removeWillChangeOnAnimationEnd,
} from "@theme/utilities";

/**
 * Custom header mega menu and drawer
 *
 * @typedef {object} Refs
 * @property {HTMLDivElement} megaMenu - the megamenu element
 * @property {HTMLDivElement} drawer - the drawer element
 */
class CustomHeaderMegaMenu extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.megamenu_opener = document.querySelector("#megamenu_opener");
  }
}

customElements.define("custom-header-megamenu", CustomHeaderMegaMenu);
