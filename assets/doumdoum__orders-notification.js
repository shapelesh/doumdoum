class NotificationManager extends HTMLElement {
  constructor() {
    super();
    this.notificationTemplate = null;
    this.notificationsList = [];
  }

  connectedCallback() {
    this.notificationTemplate = this.querySelector(
      "[data-notification-template]",
    );

    if (!this.hasRunToday()) {
      const notifications = window.doumdoumNotifications ?? [];
      this.saveNotificationsArrayToLocalStorage(notifications);
      localStorage.setItem("did-run-date", new Date().toDateString());
    }

    this.notificationsList = this.getNotificationArrayFromLocalStorage();
    this.scheduleNext();
  }

  disconnectedCallback() {
    clearTimeout(this.scheduleTimer);
    clearTimeout(this.dismissTimer);
  }
  hasRunToday() {
    const lastRunDate = localStorage.getItem("did-run-date");
    return lastRunDate === new Date().toDateString();
  }
  scheduleNext() {
    if (!this.notificationsList.length) return;

    const delayBetween = this.randomBetween(15000, 30000);
    this.scheduleTimer = setTimeout(() => {
      this.showNotification();
    }, delayBetween);
  }

  pickRandom() {
    const randomIndex = Math.floor(
      Math.random() * this.notificationsList.length,
    );
    const notification = this.notificationsList[randomIndex];
    this.notificationsList.splice(randomIndex, 1);
    this.saveNotificationsArrayToLocalStorage(this.notificationsList);
    return notification;
  }

  showNotification() {
    if (!this.notificationsList.length) return;

    const notification = this.pickRandom();
    const newNotification = this.cloneNotification();
    if (!newNotification) return;
    const splitName = notification.name.split(" ");
    if (splitName.length > 1) {
      notification.name = `${splitName[0]} <span class="blurred">${splitName[1]}</span>`;
    } else {
      notification.name = `<span class="blurred">${splitName[0]}</span>`;
    }
    this.fillOrdererName(notification.name, newNotification);
    this.fillOrdererCity(notification.city, newNotification);
    this.fillOrderPrice(
      `${notification.total.amount.replace(/\.0+$/, "")} da`,
      newNotification,
    );
    newNotification.addEventListener(
      "click",
      () => this.dismissNotification(newNotification),
      { once: true },
    );

    this.appendChild(newNotification);
    setTimeout(() => {
      newNotification.classList.add("visible");
    }, 100);
    this.dismissTimer = setTimeout(() => {
      this.dismissNotification(newNotification);
    }, 10000);
  }

  dismissNotification(notificationEl) {
    if (!notificationEl.isConnected) return;
    clearTimeout(this.dismissTimer);
    notificationEl.remove();
    this.scheduleNext();
  }

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  fillOrdererName(name, template) {
    template.querySelector("[data-orderer-name]").innerHTML = name;
  }

  fillOrdererCity(city, template) {
    template.querySelector("[data-orderer-city]").textContent = city;
  }

  fillOrderPrice(formattedPrice, template) {
    template.querySelector("[data-order-price]").textContent = formattedPrice;
  }

  cloneNotification() {
    return this.notificationTemplate?.cloneNode(true);
  }

  saveNotificationsArrayToLocalStorage(array) {
    localStorage.setItem("notifications-list", JSON.stringify(array));
  }

  getNotificationArrayFromLocalStorage() {
    return JSON.parse(localStorage.getItem("notifications-list")) ?? [];
  }
}

customElements.define("notification-manager", NotificationManager);
