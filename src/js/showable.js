export class Showable {
  constructor(element) {
    this.element = document.querySelector(element);
  }

  show() {
    this.element.classList.add('shown');
  }

  hide() {
    this.element.classList.remove('shown');
  }
}
