import { Component } from "@theme/component";
import { trapFocus, removeTrapFocus } from "@theme/focus";
import {
  onAnimationEnd,
  removeWillChangeOnAnimationEnd,
} from "@theme/utilities";

/**
 * Custom header mega menu and drawer
 *
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

    // this._handleScroll = this._closeMegaMenu.bind(this);
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
 * @property {HTMLDivElement} headerDrawer - the drawer element
 */
class CustomHeaderDrawer extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.drawerOpener = document.querySelector(
      "#doumdoum__header-drawer-opener",
    );
    this.drawerCloseButtons = this.querySelectorAll(
      ".doumdoum__header-drawer-closer-button",
    );
    this.tabOpenButton = this.querySelector("#tabOpenButton");
    this.tabReturnButton = this.querySelector(
      ".doumdoum__header-drawer-products_tab-top > svg",
    );

    this._handleOpenerClick = this._handleOpenerClick.bind(this);
    this._handleCloseClick = this._closeDrawer.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);

    this._openTab = this._openTab.bind(this);
    this._closeTab = this._closeTab.bind(this);

    this._attachListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this._detachListeners();
  }

  _attachListeners() {
    this.drawerOpener?.addEventListener("click", this._handleOpenerClick);
    this.drawerCloseButtons?.forEach((button) => {
      button.addEventListener("click", this._handleCloseClick);
    });
    document.addEventListener("click", this._handleClickOutside);
    document.addEventListener("keydown", this._handleKeyDown);
    this.tabOpenButton?.addEventListener("click", this._openTab);
    this.tabReturnButton?.addEventListener("click", this._closeTab);
  }

  _detachListeners() {
    this.drawerOpener?.removeEventListener("click", this._handleOpenerClick);
    this.drawerCloseButtons?.forEach((button) => {
      button.removeEventListener("click", this._handleCloseClick);
    });
    document.removeEventListener("click", this._handleClickOutside);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  get _isOpen() {
    return this.drawerOpener?.getAttribute("aria-expanded") === "true";
  }

  get _isTabOpen() {
    const tab = this.querySelector(".doumdoum__header-drawer-products_tab");
    if (!tab) return;
    return tab?.classList.contains("open");
  }

  _handleOpenerClick() {
    this._isOpen ? this._closeDrawer() : this._openDrawer();
  }

  _handleClickOutside(event) {
    if (!this._isOpen) return;

    const isTarget = (button) => button.contains(event.target);

    const clickedInsideDrawer = this.refs.headerDrawer?.contains(event.target);
    const clickedOpener = this.drawerOpener?.contains(event.target);
    const clickedCloser = Array.from(this.drawerCloseButtons).some(isTarget);
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
    drawer?.setAttribute("aria-hidden", "false");
    this.drawerOpener?.setAttribute("aria-expanded", "true");

    removeWillChangeOnAnimationEnd(drawer);
    onAnimationEnd(drawer, () => trapFocus(drawer));
  }

  _closeDrawer() {
    const drawer = this.refs.headerDrawer;
    if (!drawer) return;

    if (this._isTabOpen) {
      this._closeTab();
    }

    this.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    this.drawerOpener?.setAttribute("aria-expanded", "false");

    removeTrapFocus(drawer);
    removeWillChangeOnAnimationEnd(drawer);
  }

  _openTab() {
    const tab = this.querySelector(".doumdoum__header-drawer-products_tab");
    if (!tab || this._isTabOpen) return;

    tab.classList.add("open");
  }
  _closeTab() {
    const tab = this.querySelector(".doumdoum__header-drawer-products_tab");
    if (!tab || !this._isTabOpen) return;

    tab.classList.remove("open");
  }
}

customElements.define("custom-header-drawer", CustomHeaderDrawer);

/**
 * Custom header drawer
 */
class ProductCategoryTabs extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.tabButtons = this.querySelectorAll(".doumdoum__product-category-tab");
    this.pages = this.querySelectorAll(".doumdoum__product-category-page");

    this._handleChange = this._handleChange.bind(this);

    this.attachEvents();
  }

  disconnectedCallback() {}

  attachEvents() {
    Array.from(this.tabButtons).forEach((button) => {
      button.addEventListener("click", this._handleChange);
    });
  }

  get _activePage() {
    return Array.from(this.pages).find((page) =>
      page.classList.contains("open"),
    );
  }
  get _activeTabButton() {
    return Array.from(this.tabButtons).find((tabButton) =>
      tabButton.classList.contains("selected-tab"),
    );
  }
  _handleChange(event) {
    this._changePage(event);
    this._changeTab(event);
  }
  _changeTab(event) {
    const clickedTabButton = event.currentTarget;
    if (clickedTabButton === this._activeTabButton) return;

    this._activeTabButton?.classList.remove("selected-tab");
    clickedTabButton.classList.add("selected-tab");
  }
  _changePage(event) {
    const newSelectedPage = this.querySelector(
      `.doumdoum__product-category-page[data-page-handle='${event.target.dataset.tabHandle}']`,
    );

    console.log(newSelectedPage);

    if (!newSelectedPage || this._activePage === newSelectedPage) return;

    this._activePage?.classList.remove("open");
    newSelectedPage.classList.add("open");
  }
}

customElements.define("product-category-tabs", ProductCategoryTabs);
