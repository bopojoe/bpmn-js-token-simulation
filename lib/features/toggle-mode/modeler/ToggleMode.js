import {
  domify,
  classes as domClasses,
  event as domEvent,
  query as domQuery
} from 'min-dom';

import {
  TOGGLE_MODE_EVENT
} from '../../../util/EventHelper';

import {
  ToggleOffIcon,
  ToggleOnIcon
} from '../../../icons';


export default function ToggleMode(
    eventBus, canvas, selection,
    contextPad) {

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._selection = selection;
  this._contextPad = contextPad;

  this._active = false;

  eventBus.on('import.parse.start', () => {

    if (this._active) {
      this.toggleMode(false);
      
      eventBus.once('import.done', () => {
        this.toggleMode(true);
      });
    }
  });

  eventBus.on('diagram.init', () => {
    this._canvasParent = this._canvas.getContainer().parentNode;
    this._palette = domQuery('.djs-palette', this._canvas.getContainer());

    this._init();
  });
}

ToggleMode.prototype._init = function() {
  this._container = domify(`
    <div class="bts-toggle-mode">
      Token Simulation <span class="bts-toggle">${ ToggleOffIcon() }</span>
    </div>
  `);

  domEvent.bind(this._container, 'click', () => this.toggleMode());

  this._canvas.getContainer().appendChild(this._container);
};

ToggleMode.prototype.toggleMode = function(active = !this._active) {

  if (active === this._active) {
    return;
  }

  const checkArr = async (arr) =>{

  }

  const buttonOff = (input) => {
    let currentCanvas = this._canvas;
    
    let children = currentCanvas._container.children
    const buttons = document.getElementsByClassName("bjsl-button");
    //buttons[0].style.visibility = 'hidden !important';
    domClasses(buttons[0]).add('bjsl-button-inactive');
    domClasses(buttons[0]).add('hidden');
    
        console .log('canvas is:', children);
        console.log('buttons arr', buttons[0]);
    return input
  }

  const buttonOn = (input) => {
    let currentCanvas = this._canvas;
    
    let children = currentCanvas._container.children
    const buttons = document.getElementsByClassName("bjsl-button");
    //buttons[0].style.visibility = 'hidden !important';
    domClasses(buttons[0]).remove('hidden');
        console .log('canvas is:', children);
        console.log('buttons arr', buttons[0]);
    return input
  }

  if (active) {
    this._container.innerHTML = `Token Simulation <span class="bts-toggle">${ buttonOff(ToggleOnIcon()) }</span>`;

    domClasses(this._canvasParent).add('simulation');
    domClasses(this._palette).add('hidden');
  } else {
    this._container.innerHTML = `Token Simulation <span class="bts-toggle">${  buttonOn(ToggleOffIcon()) }</span>`;

    domClasses(this._canvasParent).remove('simulation');
    domClasses(this._palette).remove('hidden');

    const elements = this._selection.get();

    if (elements.length === 1) {
      this._contextPad.open(elements[0]);
    }
  }

  this._eventBus.fire(TOGGLE_MODE_EVENT, {
    active
  });

  this._active = active;
};

ToggleMode.$inject = [
  'eventBus',
  'canvas',
  'selection',
  'contextPad'
];
