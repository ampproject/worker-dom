import { AutomationRate, IAudioParam } from './AudioTypes';
import { TransferrableAudio } from './TransferrableAudio';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { BaseAudioContext } from './BaseAudioContext';

// TODO: recheck value change schedule implementation
export class AudioParam extends TransferrableAudio implements IAudioParam {
  automationRate: AutomationRate;
  readonly defaultValue: number = 1;
  readonly maxValue: number = 3.4028234663852886e38;
  readonly minValue: number = -3.4028234663852886e38;
  private _value: number = this.defaultValue;
  private schedule: any = null;
  private readonly context: BaseAudioContext;

  constructor(id: number, context: BaseAudioContext, automationRate?: AutomationRate, defaultValue?: number) {
    super(id, context.document);
    this.automationRate = automationRate || 'a-rate';
    this.defaultValue = defaultValue || 1;
    this._value = this.defaultValue;
    this.context = context;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (this._value != value) {
      this.setProperty('value', value);
      this._value = value;
    }
  }

  cancelAndHoldAtTime(cancelTime: number): IAudioParam {
    this[TransferrableKeys.mutated]('cancelAndHoldAtTime', [...arguments]);
    if (cancelTime > this.context.currentTime) {
      setTimeout(
        (me: AudioParam) => {
          clearTimeout(me.schedule);
        },
        (cancelTime - this.context.currentTime) * 1000,
        this,
      );
    }
    return this;
  }

  cancelScheduledValues(cancelTime: number): IAudioParam {
    this[TransferrableKeys.mutated]('cancelScheduledValues', [...arguments]);
    if (cancelTime > this.context.currentTime) {
      setTimeout(
        (me: AudioParam) => {
          clearTimeout(me.schedule);
        },
        (cancelTime - this.context.currentTime) * 1000,
        this,
      );
    }
    return this;
  }

  exponentialRampToValueAtTime(value: number, endTime: number): IAudioParam {
    this[TransferrableKeys.mutated]('exponentialRampToValueAtTime', [...arguments]);

    let currentTime = this.context.currentTime;

    if (currentTime >= endTime) {
      this._value = value;
    } else {
      value = Math.max(0.00001, value);
      const startValue = Math.max(0.00001, this._value);
      const duration = endTime - currentTime;
      const timeConstant = Math.log(value / startValue) / (endTime - currentTime);

      function updateValue(me: AudioParam) {
        currentTime = me.context.currentTime;
        if (currentTime >= endTime) {
          me._value = value;
        } else {
          const deltaTime = currentTime - (endTime - duration);
          me._value = startValue * Math.exp(timeConstant * deltaTime);
          me.schedule = setTimeout(updateValue, 16, me);
        }
      }

      updateValue(this);
    }
    return this;
  }

  linearRampToValueAtTime(value: number, endTime: number): IAudioParam {
    this[TransferrableKeys.mutated]('linearRampToValueAtTime', [...arguments]);

    let currentTime = this.context.currentTime;

    if (currentTime >= endTime) {
      this._value = value;
    } else {
      const startValue = this._value;
      const duration = endTime - currentTime;
      const increment = (value - startValue) / duration;

      function updateValue(me: AudioParam) {
        currentTime = me.context.currentTime;
        if (currentTime >= endTime) {
          me._value = value;
        } else {
          const deltaTime = currentTime - (endTime - duration);
          me._value = startValue + increment * deltaTime;
          me.schedule = setTimeout(updateValue, 16, me);
        }
      }

      updateValue(this);
    }

    return this;
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number): IAudioParam {
    this[TransferrableKeys.mutated]('setTargetAtTime', [...arguments]);

    const startValue = this._value;
    const duration = timeConstant * Math.log(1 + (target - startValue) / (target - startValue));
    const increment = (target - startValue) / duration;

    function updateValue(me: AudioParam) {
      const currentTime = me.context.currentTime;
      if (currentTime >= startTime + duration) {
        me._value = target;
      } else {
        const deltaTime = currentTime - startTime;
        me._value = startValue + increment * deltaTime;
        me.schedule = setTimeout(updateValue, 10, me);
      }
    }

    if (this.context.currentTime >= startTime) {
      updateValue(this);
    } else {
      this.schedule = setTimeout(updateValue, (startTime - this.context.currentTime) * 1000, this);
    }
    return this;
  }

  setValueAtTime(value: number, startTime: number): IAudioParam {
    if (startTime < 0) {
      throw new TypeError('startTime must not be negative');
    }
    const currentTime = this.context.currentTime;
    if (startTime <= currentTime) {
      this.value = value;
    } else {
      this[TransferrableKeys.mutated]('setValueAtTime', [...arguments]);
      this.schedule = setTimeout(() => {
        this._value = value;
      }, (startTime - currentTime) * 1000);
    }
    return this;
  }

  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): IAudioParam {
    this[TransferrableKeys.mutated]('setValueCurveAtTime', [...arguments]);

    const interval = (duration * 1000) / values.length;

    function updateValue(index: number, me: AudioParam) {
      if (index < values.length) {
        me._value = values[index];
        me.schedule = setTimeout(updateValue, interval, ++index, me);
      }
    }

    if (this.context.currentTime >= startTime) {
      updateValue(0, this);
    } else {
      this.schedule = setTimeout(updateValue, (startTime - this.context.currentTime) * 1000, 0, this);
    }

    return this;
  }
}
