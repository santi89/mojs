import { Timeline } from '../tween/timeline.babel.js';
import { Tweenable } from '../tween/tweenable.babel.js';
import { staggerProperty } from '../helpers/stagger-property.babel.js';
import { staggerFunction } from './stagger-function.babel.js';
import { staggerRand } from './stagger-rand.babel.js';
import { staggerRandFloat } from './stagger-rand-float.babel.js';
import { staggerStep } from './stagger-step.babel.js';
import { staggerMap } from './stagger-map.babel.js';

/* -------------------- */
/* The `Stagger` class  */
/* -------------------- */

const Super = Tweenable.__mojsClass;
const Stagger = Object.create(Super);

/**
 * `init` - function init the class.
 *
 * @extends @Tweenable
 * @public
 */
Stagger.init = function (o = {}, Module) {
  // super call
  Super.init.call(this, o);
  // create main timeline
  this._createTimeline(o.staggerTimeline);
  delete this._o.staggerTimeline;
  // create modules
  this._createModules(Module);
};

/**
 * `_createModules` - function to create modules.
 *
 * @private
 * @param {Object} Child module class.
 */
Stagger._createModules = function (Module) {
  this._modules = [];
  const { items, el = {} } = this._o;
  const modulesCount = items || el.length || 1;

  for (let i = 0; i < modulesCount; i++) {
    const module = new Module({
      ...this._getStaggerOptions(this._o, i, modulesCount),
      totalItemsInStagger: modulesCount,
    });
    this._modules.push(module);
    // get method regarding stagger strategy property and parse stagger function
    const addMethod = staggerProperty(this._o.strategy || 'add', i, modulesCount);
    this.timeline[addMethod](module);
  }
};

/**
 * `_getStaggerOptions` - get stagger options for a single module.
 *
 * @private
 * @param {Object} Stagger options.
 * @param {Number} Index of a module.
 */
Stagger._getStaggerOptions = function (options, i, modulesCount) {
  // pass index to child properties
  const o = { index: i };

  const keys = Object.keys(options);
  for (let j = 0; j < keys.length; j++) {
    const key = keys[j];
    // `items` - is the special `stagger` keyword, filter out it
    if (key !== 'items' && key !== 'strategy') {
      o[key] = staggerProperty(options[key], i, modulesCount);
    }
  }

  return o;
};

/**
 * `_createTimeline` - function to create a timeline.
 *
 * @private
 * @param {Object} Timeline options.
 */
Stagger._createTimeline = function (options) {
  this.timeline = new Timeline(options);
};

/**
 * function to wrap a Module with the stagger wrapper.
 */
const stagger = (Module) => { // eslint-disable-line arrow-body-style
  return (options) => {
    const instance = Object.create(Stagger);
    instance.init(options, Module);

    return instance;
  };
};

stagger.function = staggerFunction;
stagger.rand = staggerRand;
stagger.randFloat = staggerRandFloat;
stagger.step = staggerStep;
stagger.map = staggerMap;

export { stagger };
