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
 */
class CustomHeaderMegaMenu extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.megamenuOpener = document.querySelector("#megamenu_opener");

    this._handleOpenerClick = this._handleOpenerClick.bind(this);
    this._handleChangeTab = this._handleChangeTab.bind(this);

    this._attachListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._detachListeners();
  }

  _getTabButtons() {
    return this.querySelectorAll('[data-type="tab-button"]');
  }

  _getTabs() {
    return this.querySelectorAll('[data-type="tab"]');
  }

  _attachListeners() {
    this._getTabButtons().forEach((button) => {
      button.addEventListener("click", this._handleChangeTab);
    });

    this.megamenuOpener?.addEventListener("click", this._handleOpenerClick);

    this._handleScroll = this._closeMegaMenu.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);

    window.addEventListener("scroll", this._handleScroll, { passive: true });
    document.addEventListener("click", this._handleClickOutside);
  }

  _detachListeners() {
    this._getTabButtons().forEach((button) => {
      button.removeEventListener("click", this._handleChangeTab);
    });

    this.megamenuOpener?.removeEventListener("click", this._handleOpenerClick);
    window.removeEventListener("scroll", this._handleScroll);
    document.removeEventListener("click", this._handleClickOutside);
  }

  _handleClickOutside(event) {
    const isOpen =
      this.megamenuOpener?.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    const clickedInsideMenu = this.contains(event.target);
    const clickedOpener = this.megamenuOpener?.contains(event.target);

    if (!clickedInsideMenu && !clickedOpener) {
      this._closeMegaMenu();
    }
  }

  _handleOpenerClick() {
    const isOpen = this.megamenuOpener.getAttribute("aria-expanded") === "true";
    isOpen ? this._closeMegaMenu() : this._openMegaMenu();
  }

  _handleChangeTab(event) {
    const { handle } = event.currentTarget.dataset;

    this._getTabButtons().forEach((button) => {
      const isSelected = button.dataset.handle === handle;
      button.classList.toggle("selected_tab", isSelected);
      button.setAttribute("aria-selected", isSelected);
    });

    this._getTabs().forEach((tab) => {
      const isSelected = tab.dataset.handle === handle;
      tab.classList.toggle("selected_tab", isSelected);
      tab.setAttribute("aria-hidden", !isSelected);
    });
  }

  _openMegaMenu() {
    const menu = this.refs.megaMenu;
    if (!menu) return;

    menu.setAttribute("aria-hidden", "false");
    this.megamenuOpener?.setAttribute("aria-expanded", "true");

    removeWillChangeOnAnimationEnd(menu);
    onAnimationEnd(menu, () => trapFocus(menu));
  }

  _closeMegaMenu() {
    const menu = this.refs.megaMenu;
    if (!menu) return;

    menu.setAttribute("aria-hidden", "true");
    this.megamenuOpener?.setAttribute("aria-expanded", "false");

    removeTrapFocus(menu);
    removeWillChangeOnAnimationEnd(menu);
  }
}

customElements.define("custom-header-megamenu", CustomHeaderMegaMenu);

/**
 * Custom header drawer
 *
 * @typedef {object} Refs
 * @property {HTMLDivElement} headerDrawer - the drawer element
 */
class CustomHeaderDrawer extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.drawerOpener = document.querySelector(
      "#doumdoum__header-drawer-opener",
    );
    this.drawerCloseButton = this.querySelector(
      "#doumdoum__header-drawer-closer",
    );

    this._handleOpenerClick = this._handleOpenerClick.bind(this);
    this._handleCloseClick = this._closeDrawer.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);

    this._attachListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._detachListeners();
  }

  _attachListeners() {
    this.drawerOpener?.addEventListener("click", this._handleOpenerClick);
    this.drawerCloseButton?.addEventListener("click", this._handleCloseClick);
    document.addEventListener("click", this._handleClickOutside);
    document.addEventListener("keydown", this._handleKeyDown);
  }

  _detachListeners() {
    this.drawerOpener?.removeEventListener("click", this._handleOpenerClick);
    this.drawerCloseButton?.removeEventListener(
      "click",
      this._handleCloseClick,
    );
    document.removeEventListener("click", this._handleClickOutside);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  get _isOpen() {
    return this.drawerOpener?.getAttribute("aria-expanded") === "true";
  }

  _handleOpenerClick() {
    this._isOpen ? this._closeDrawer() : this._openDrawer();
  }

  _handleClickOutside(event) {
    if (!this._isOpen) return;

    const clickedInsideDrawer = this.refs.headerDrawer?.contains(event.target);
    const clickedOpener = this.drawerOpener?.contains(event.target);
    const clickedCloser = this.drawerCloseButton?.contains(event.target);

    if (!clickedInsideDrawer && !clickedOpener && !clickedCloser) {
      this._closeDrawer();
    }
  }

  _handleKeyDown(event) {
    if (event.key === "Escape" && this._isOpen) this._closeDrawer();
  }

  _openDrawer() {
    const drawer = this.refs.headerDrawer;
    if (!drawer) return;

    this.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    this.drawerOpener?.setAttribute("aria-expanded", "true");

    removeWillChangeOnAnimationEnd(drawer);
    onAnimationEnd(drawer, () => trapFocus(drawer));
  }

  _closeDrawer() {
    const drawer = this.refs.headerDrawer;
    if (!drawer) return;

    this.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    this.drawerOpener?.setAttribute("aria-expanded", "false");

    removeTrapFocus(drawer);
    removeWillChangeOnAnimationEnd(drawer);
  }
}

customElements.define("custom-header-drawer", CustomHeaderDrawer);
