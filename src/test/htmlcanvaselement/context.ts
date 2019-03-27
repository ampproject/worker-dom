/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import anyTest, { TestInterface, afterEach } from 'ava';
import * as sinon from 'sinon';
import { CanvasRenderingContext2D, deferredUpgrades } from '../../worker-thread/CanvasRenderingContext2D';
import { createDocument } from '../../worker-thread/dom/Document';
import { HTMLCanvasElement } from '../../worker-thread/dom/HTMLCanvasElement';
import { CanvasRenderingContext2DImplementation } from '../../worker-thread/DOMTypes';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';

const test = anyTest as TestInterface<{
    canvas: HTMLCanvasElement,
    context2d: CanvasRenderingContext2D;
    deferredUpgrade: {resolve: (instance: OffscreenCanvas) => void, reject: (errorMsg: string) => void};
    implementation: CanvasRenderingContext2DImplementation;
    image: HTMLImageElement;
}>;

let sandbox: sinon.SinonSandbox;

class OffscreenCanvas {
    public static implementation: CanvasRenderingContext2DImplementation;
    public ownedImplementation: CanvasRenderingContext2DImplementation;

    constructor() {
        // this.x, y
        const context = ({} as unknown) as CanvasRenderingContext2DImplementation;
        OffscreenCanvas.implementation = context;
        this.ownedImplementation = context;
    }

    getContext(c: string): CanvasRenderingContext2DImplementation {
        return this.ownedImplementation;
    }

}
(global as any).OffscreenCanvas = OffscreenCanvas;

test.beforeEach(t => {
    sandbox = sinon.createSandbox();
    const document = createDocument();
    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    t.context = {
        canvas,
        context2d: canvas.getContext('2d'),
        deferredUpgrade: deferredUpgrades.get(canvas),
        implementation: OffscreenCanvas.implementation,
        image: document.createElement('img') as HTMLImageElement,
    };
});

describe('clearRect', () => {
    test('context calls clearRect', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "clearRect");
        context2d.clearRect(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });
    
    test('context only calls upgraded clearRect if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "clearRect");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.clearRect(1, 2, 3, 4);
            t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
        });
    });

    test('context calls both versions of clearRect when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "clearRect");
        const implStub = createStub(implementation, "clearRect");

        context2d.clearRect(10, 9, 8, 7);
        t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
        });
    });
});

describe('fillRect', () => {
    test('context calls fillRect', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "fillRect");
        context2d.fillRect(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded fillRect if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "fillRect");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.fillRect(1, 2, 3, 4);
            t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
        });
    });

    test('context calls both versions of fillRect when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "fillRect");
        const implStub = createStub(implementation, "fillRect");

        context2d.fillRect(10, 9, 8, 7);
        t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
        });
    });
});

describe('strokeRect', () => {
    test('context calls strokeRect', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "strokeRect");
        context2d.strokeRect(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded strokeRect if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "strokeRect");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.strokeRect(1, 2, 3, 4);
            t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
        });
    });

    test('context calls both versions of strokeRect when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "strokeRect");
        const implStub = createStub(implementation, "strokeRect");

        context2d.strokeRect(10, 9, 8, 7);
        t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
        });
    });
});

describe('fillText', () => {
    test('context calls fillText', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "fillText");
        context2d.fillText("hello, world", 1, 2);
        t.true(stub.withArgs("hello, world", 1, 2).calledOnce);
    });

    test('context only calls upgraded fillText if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "fillText");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.fillText("hello, world", 1, 2);
            t.true(stub.withArgs("hello, world", 1, 2).calledOnce);
        });
    });

    test('context calls both versions of fillText when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "fillText");
        const implStub = createStub(implementation, "fillText");

        context2d.fillText("hello, world", 1, 2);
        t.true(implStub.withArgs("hello, world", 1, 2).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs("hello, world", 1, 2).calledOnce);
        });
    });
});

describe('strokeText', () => {
    test('context calls strokeText', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "strokeText");
        context2d.strokeText("hello, world", 1, 2);
        t.true(stub.withArgs("hello, world", 1, 2).calledOnce);
    });

    test('context only calls upgraded strokeText if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "strokeText");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.strokeText("hello, world", 1, 2);
            t.true(stub.withArgs("hello, world", 1, 2).calledOnce);
        });
    });

    test('context calls both versions of strokeText when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "strokeText");
        const implStub = createStub(implementation, "strokeText");

        context2d.strokeText("hello, world", 1, 2);
        t.true(implStub.withArgs("hello, world", 1, 2).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs("hello, world", 1, 2).calledOnce);
        });
    });
});

describe('measureText', () => {
    test('context calls measureText', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "measureText");
        context2d.measureText("hello, world");
        t.true(stub.withArgs("hello, world").calledOnce);
    });

    test('context only calls upgraded measureText if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "measureText");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.measureText("hello, world");
            t.true(stub.withArgs("hello, world").calledOnce);
        });
    });

    test('context calls both versions of measureText when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "measureText");
        const implStub = createStub(implementation, "measureText");

        context2d.measureText("hello, world");
        t.true(implStub.withArgs("hello, world").calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs("hello, world").calledOnce);
        });
    });
});

describe('lineWidth', () => {
    test('context calls set lineWidth', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "lineWidth", spy);
        context2d.lineWidth = 100;
        t.true(spy.withArgs(100).calledOnce);
    });

    test('context only calls upgraded set lineWidth if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "lineWidth", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.lineWidth = 100;
            t.true(spy.withArgs(100).calledOnce);
        });
    });

    test('context calls both versions of set lineWidth when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "lineWidth", instanceSpy);
        createSetterStub(implementation, "lineWidth", implSpy);

        context2d.lineWidth = 200;
        t.true(implSpy.withArgs(200).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(200).calledOnce);
        });
    });
});

describe('lineCap', () => {
    test('context calls set lineCap', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "lineCap", spy);
        context2d.lineCap = "butt";
        t.true(spy.withArgs("butt").calledOnce);
    });

    test('context only calls upgraded set lineCap if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "lineCap", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.lineCap = "butt";
            t.true(spy.withArgs("butt").calledOnce);
        });
    });

    test('context calls both versions of set lineCap when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "lineCap", instanceSpy);
        createSetterStub(implementation, "lineCap", implSpy);

        context2d.lineCap = "round";
        t.true(implSpy.withArgs("round").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("round").calledOnce);
        });
    });
});

describe('lineJoin', () => {
    test('context calls set lineJoin', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "lineJoin", spy);
        context2d.lineJoin = "bevel";
        t.true(spy.withArgs("bevel").calledOnce);
    });

    test('context only calls upgraded set lineJoin if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "lineJoin", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.lineJoin = "bevel";
            t.true(spy.withArgs("bevel").calledOnce);
        });
    });

    test('context calls both versions of set lineJoin when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "lineJoin", instanceSpy);
        createSetterStub(implementation, "lineJoin", implSpy);

        context2d.lineJoin = "miter";
        t.true(implSpy.withArgs("miter").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("miter").calledOnce);
        });
    });
});

describe('miterLimit', () => {
    test('context calls set miterLimit', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "miterLimit", spy);
        context2d.miterLimit = 50;
        t.true(spy.withArgs(50).calledOnce);
    });

    test('context only calls upgraded set miterLimit if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "miterLimit", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.miterLimit = 100;
            t.true(spy.withArgs(100).calledOnce);
        });
    });

    test('context calls both versions of set miterLimit when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "miterLimit", instanceSpy);
        createSetterStub(implementation, "miterLimit", implSpy);

        context2d.miterLimit = 200;
        t.true(implSpy.withArgs(200).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(200).calledOnce);
        });
    });
});

describe('getLineDash', () => {
    test('context calls getLineDash', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "getLineDash");
        context2d.getLineDash();
        t.true(stub.calledOnce);
    });

    test('context only calls upgraded getLineDash if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "getLineDash");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.getLineDash();
            t.true(stub.calledOnce);
        });
    });

    test('context calls both versions of getLineDash when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "getLineDash");
        const implStub = createStub(implementation, "getLineDash");

        context2d.getLineDash();
        t.true(implStub.calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.calledOnce);
        });
    });
});

describe('setLineDash', () => {
    test('context calls setLineDash', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "setLineDash");
        context2d.setLineDash([1, 2, 3, 4]);
        t.true(stub.withArgs([1, 2, 3, 4]).calledOnce);
    });

    test('context only calls upgraded setLineDash if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "setLineDash");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.setLineDash([1, 2, 3, 4]);
            t.true(stub.withArgs([1, 2, 3, 4]).calledOnce);
        });
    });

    test('context calls both versions of setLineDash when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "setLineDash");
        const implStub = createStub(implementation, "setLineDash");

        context2d.setLineDash([0, 1, 2]);
        t.true(implStub.withArgs([0, 1, 2]).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs([0, 1, 2]).calledOnce);
        });
    });
});

describe('lineDashOffset', () => {
    test('context calls set lineDashOffset', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "lineDashOffset", spy);
        context2d.lineDashOffset = 150;
        t.true(spy.withArgs(150).calledOnce);
    });

    test('context only calls upgraded set lineDashOffset if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "lineDashOffset", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.lineDashOffset = 200;
            t.true(spy.withArgs(200).calledOnce);
        });
    });

    test('context calls both versions of set lineDashOffset when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "lineDashOffset", instanceSpy);
        createSetterStub(implementation, "lineDashOffset", implSpy);

        context2d.lineDashOffset = 50;
        t.true(implSpy.withArgs(50).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(50).calledOnce);
        });
    });
});

describe('font', () => {
    test('context calls set font', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "font", spy);
        context2d.font = "Times";
        t.true(spy.withArgs("Times").calledOnce);
    });

    test('context only calls upgraded set font if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "font", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.font = "Arial";
            t.true(spy.withArgs("Arial").calledOnce);
        });
    });

    test('context calls both versions of set font when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "font", instanceSpy);
        createSetterStub(implementation, "font", implSpy);

        context2d.font = "Courier";
        t.true(implSpy.withArgs("Courier").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("Courier").calledOnce);
        });
    });
});

describe('textAlign', () => {
    test('context calls set textAlign', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "textAlign", spy);
        context2d.textAlign = "center";
        t.true(spy.withArgs("center").calledOnce);
    });

    test('context only calls upgraded set textAlign if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "textAlign", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.textAlign = "left";
            t.true(spy.withArgs("left").calledOnce);
        });
    });

    test('context calls both versions of set textAlign when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "textAlign", instanceSpy);
        createSetterStub(implementation, "textAlign", implSpy);

        context2d.textAlign = "end";
        t.true(implSpy.withArgs("end").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("end").calledOnce);
        });
    });
});

describe('textBaseline', () => {
    test('context calls set textBaseline', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "textBaseline", spy);
        context2d.textBaseline = "alphabetic";
        t.true(spy.withArgs("alphabetic").calledOnce);
    });

    test('context only calls upgraded set textBaseline if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "textBaseline", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.textBaseline = "middle";
            t.true(spy.withArgs("middle").calledOnce);
        });
    });

    test('context calls both versions of set textBaseline when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "textBaseline", instanceSpy);
        createSetterStub(implementation, "textBaseline", implSpy);

        context2d.textBaseline = "hanging";
        t.true(implSpy.withArgs("hanging").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("hanging").calledOnce);
        });
    });
});

describe('direction', () => {
    test('context calls set direction', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "direction", spy);
        context2d.direction = "rtl";
        t.true(spy.withArgs("rtl").calledOnce);
    });

    test('context only calls upgraded set direction if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "direction", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.direction = "ltr";
            t.true(spy.withArgs("ltr").calledOnce);
        });
    });

    test('context calls both versions of set direction when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "direction", instanceSpy);
        createSetterStub(implementation, "direction", implSpy);

        context2d.direction = "inherit";
        t.true(implSpy.withArgs("inherit").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("inherit").calledOnce);
        });
    });
});

describe('fillStyle', () => {
    test('context calls set fillStyle', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "fillStyle", spy);
        context2d.fillStyle = "red";
        t.true(spy.withArgs("red").calledOnce);
    });

    test('context only calls upgraded set fillStyle if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "fillStyle", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.fillStyle = "yellow";
            t.true(spy.withArgs("yellow").calledOnce);
        });
    });

    test('context calls both versions of set fillStyle when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "fillStyle", instanceSpy);
        createSetterStub(implementation, "fillStyle", implSpy);

        context2d.fillStyle = "black";
        t.true(implSpy.withArgs("black").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("black").calledOnce);
        });
    });
});

describe('strokeStyle', () => {
    test('context calls set strokeStyle', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "strokeStyle", spy);
        context2d.strokeStyle = "blue";
        t.true(spy.withArgs("blue").calledOnce);
    });

    test('context only calls upgraded set strokeStyle if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "strokeStyle", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.strokeStyle = "green";
            t.true(spy.withArgs("green").calledOnce);
        });
    });

    test('context calls both versions of set strokeStyle when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "strokeStyle", instanceSpy);
        createSetterStub(implementation, "strokeStyle", implSpy);

        context2d.strokeStyle = "black";
        t.true(implSpy.withArgs("black").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("black").calledOnce);
        });
    });
});

describe('createLinearGradient', () => {
    test('context calls createLinearGradient', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "createLinearGradient");
        context2d.createLinearGradient(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded createLinearGradient if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "createLinearGradient");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.createLinearGradient(1, 2, 3, 4);
            t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
        });
    });

    test('context calls both versions of createLinearGradient when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "createLinearGradient");
        const implStub = createStub(implementation, "createLinearGradient");

        context2d.createLinearGradient(0, 1, 2, 3);
        t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
        });
    });
});

describe('createRadialGradient', () => {
    test('context calls createRadialGradient', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "createRadialGradient");
        context2d.createRadialGradient(1, 2, 3, 4, 5, 6);
        t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
    });

    test('context only calls upgraded createRadialGradient if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "createRadialGradient");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.createRadialGradient(1, 2, 3, 4, 5, 6);
            t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
        });
    });

    test('context calls both versions of createRadialGradient when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "createRadialGradient");
        const implStub = createStub(implementation, "createRadialGradient");

        context2d.createRadialGradient(0, 1, 2, 3, 4, 5);
        t.true(implStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
        });
    });
});

describe('createPattern', () => {
    test.skip('context calls createPattern', t => {
        const { context2d, implementation, image } = t.context;
        const stub = createStub(implementation, "createPattern");

        const imageBitmapPromise = createImageBitmap((image as unknown) as ImageBitmapSource, 10, 20, 30, 40);
        imageBitmapPromise.then((imageBitmap) => {
            context2d.createPattern(imageBitmap, "repeat");
            t.true(stub.withArgs(imageBitmap, "repeat").calledOnce);
        });
    });
});

describe('shadowBlur', () => {
    test('context calls set shadowBlur', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "shadowBlur", spy);
        context2d.shadowBlur = 200;
        t.true(spy.withArgs(200).calledOnce);
    });

    test('context only calls upgraded set shadowBlur if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "shadowBlur", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.shadowBlur = 500;
            t.true(spy.withArgs(500).calledOnce);
        });
    });

    test('context calls both versions of set shadowBlur when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "shadowBlur", instanceSpy);
        createSetterStub(implementation, "shadowBlur", implSpy);

        context2d.shadowBlur = 300;
        t.true(implSpy.withArgs(300).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(300).calledOnce);
        });
    });
});

describe('shadowColor', () => {
    test('context calls set shadowColor', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "shadowColor", spy);
        context2d.shadowColor = "green";
        t.true(spy.withArgs("green").calledOnce);
    });

    test('context only calls upgraded set shadowColor if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "shadowColor", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.shadowColor = "red";
            t.true(spy.withArgs("red").calledOnce);
        });
    });

    test('context calls both versions of set shadowColor when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "shadowColor", instanceSpy);
        createSetterStub(implementation, "shadowColor", implSpy);

        context2d.shadowColor = "blue";
        t.true(implSpy.withArgs("blue").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("blue").calledOnce);
        });
    });
});

describe('shadowOffsetX', () => {
    test('context calls set shadowOffsetX', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "shadowOffsetX", spy);
        context2d.shadowOffsetX = 250;
        t.true(spy.withArgs(250).calledOnce);
    });

    test('context only calls upgraded set shadowOffsetX if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "shadowOffsetX", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.shadowOffsetX = 200;
            t.true(spy.withArgs(200).calledOnce);
        });
    });

    test('context calls both versions of set shadowOffsetX when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "shadowOffsetX", instanceSpy);
        createSetterStub(implementation, "shadowOffsetX", implSpy);

        context2d.shadowOffsetX = 20;
        t.true(implSpy.withArgs(20).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(20).calledOnce);
        });
    });
});

describe('shadowOffsetY', () => {
    test('context calls set shadowOffsetY', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "shadowOffsetY", spy);
        context2d.shadowOffsetY = 300;
        t.true(spy.withArgs(300).calledOnce);
    });

    test('context only calls upgraded set shadowOffsetY if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "shadowOffsetY", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.shadowOffsetY = 200;
            t.true(spy.withArgs(200).calledOnce);
        });
    });

    test('context calls both versions of set shadowOffsetY when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "shadowOffsetY", instanceSpy);
        createSetterStub(implementation, "shadowOffsetY", implSpy);

        context2d.shadowOffsetY = 20;
        t.true(implSpy.withArgs(20).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(20).calledOnce);
        });
    });
});

describe('beginPath', () => {
    test.skip('context calls beginPath', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "beginPath");
        context2d.beginPath();
        t.true(stub.calledOnce);
    });
});

describe('closePath', () => {
    test.skip('context calls closePath', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "closePath");
        context2d.closePath();
        t.true(stub.withArgs().calledOnce);
    });
});

describe('moveTo', () => {
    test('context calls moveTo', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "moveTo");
        context2d.moveTo(1, 1);
        t.true(stub.withArgs(1, 1).calledOnce);
    });

    test('context only calls upgraded moveTo if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "moveTo");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.moveTo(1, 2);
            t.true(stub.withArgs(1, 2).calledOnce);
        });
    });

    test('context calls both versions of moveTo when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "moveTo");
        const implStub = createStub(implementation, "moveTo");

        context2d.moveTo(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('lineTo', () => {
    test('context calls lineTo', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "lineTo");
        context2d.lineTo(1, 1);
        t.true(stub.withArgs(1, 1).calledOnce);
    });

    test('context only calls upgraded lineTo if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "lineTo");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.lineTo(1, 2);
            t.true(stub.withArgs(1, 2).calledOnce);
        });
    });

    test('context calls both versions of lineTo when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "lineTo");
        const implStub = createStub(implementation, "lineTo");

        context2d.lineTo(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('bezierCurveTo', () => {
    test('context calls bezierCurveTo', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "bezierCurveTo");
        context2d.bezierCurveTo(1, 2, 3, 4, 5, 6);
        t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
    });

    test('context only calls upgraded bezierCurveTo if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "bezierCurveTo");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.bezierCurveTo(6, 5, 4, 3, 2, 1);
            t.true(stub.withArgs(6, 5, 4, 3, 2, 1).calledOnce);
        });
    });

    test('context calls both versions of bezierCurveTo when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "bezierCurveTo");
        const implStub = createStub(implementation, "bezierCurveTo");

        context2d.bezierCurveTo(0, 1, 2, 3, 4, 5);
        t.true(implStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
        });
    });
});

describe('quadraticCurveTo', () => {
    test('context calls quadraticCurveTo', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "quadraticCurveTo");
        context2d.quadraticCurveTo(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded quadraticCurveTo if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "quadraticCurveTo");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.quadraticCurveTo(6, 5, 4, 3);
            t.true(stub.withArgs(6, 5, 4, 3).calledOnce);
        });
    });

    test('context calls both versions of quadraticCurveTo when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "quadraticCurveTo");
        const implStub = createStub(implementation, "quadraticCurveTo");

        context2d.quadraticCurveTo(0, 1, 2, 3);
        t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
        });
    });
});

describe('arc', () => {
    test('context calls arc', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "arc");
        context2d.arc(1, 2, 3, 4, 5);
        t.true(stub.withArgs(1, 2, 3, 4, 5).calledOnce);
    });

    test('context only calls upgraded arc if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "arc");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.arc(6, 5, 4, 3, 2);
            t.true(stub.withArgs(6, 5, 4, 3, 2).calledOnce);
        });
    });

    test('context calls both versions of arc when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "arc");
        const implStub = createStub(implementation, "arc");

        context2d.arc(0, 1, 2, 3, 4);
        t.true(implStub.withArgs(0, 1, 2, 3, 4).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3, 4).calledOnce);
        });
    });
});

describe('arcTo', () => {
    test('context calls arcTo', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "arcTo");
        context2d.arcTo(1, 2, 3, 4, 5);
        t.true(stub.withArgs(1, 2, 3, 4, 5).calledOnce);
    });

    test('context only calls upgraded arcTo if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "arcTo");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.arcTo(6, 5, 4, 3, 2);
            t.true(stub.withArgs(6, 5, 4, 3, 2).calledOnce);
        });
    });

    test('context calls both versions of arcTo when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "arcTo");
        const implStub = createStub(implementation, "arcTo");

        context2d.arcTo(0, 1, 2, 3, 4);
        t.true(implStub.withArgs(0, 1, 2, 3, 4).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3, 4).calledOnce);
        });
    });
});

describe('ellipse', () => {
    test('context calls ellipse', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "ellipse");
        context2d.ellipse(1, 2, 3, 4, 5, 6, 7);
        t.true(stub.withArgs(1, 2, 3, 4, 5, 6, 7).calledOnce);
    });

    test('context only calls upgraded ellipse if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "ellipse");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.ellipse(7, 6, 5, 4, 3, 2, 1);
            t.true(stub.withArgs(7, 6, 5, 4, 3, 2, 1).calledOnce);
        });
    });

    test('context calls both versions of ellipse when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "ellipse");
        const implStub = createStub(implementation, "ellipse");

        context2d.ellipse(0, 1, 2, 3, 4, 5, 6);
        t.true(implStub.withArgs(0, 1, 2, 3, 4, 5, 6).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5, 6).calledOnce);
        });
    });
});

describe('rect', () => {
    test('context calls rect', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "rect");
        context2d.rect(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded rect if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "rect");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.rect(4, 3, 2, 1);
            t.true(stub.withArgs(4, 3, 2, 1).calledOnce);
        });
    });

    test('context calls both versions of rect when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "rect");
        const implStub = createStub(implementation, "rect");

        context2d.rect(0, 1, 2, 3);
        t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
        });
    });
});

// this method has multiple signatures, test all??
describe('fill', () => {
    test('context calls fill', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "fill");
        context2d.fill("nonzero");
        t.true(stub.withArgs("nonzero").calledOnce);
    });

    test('context only calls upgraded fill if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "fill");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.fill("evenodd");
            t.true(stub.withArgs("evenodd").calledOnce);
        });
    });

    test('context calls both versions of fill when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "fill");
        const implStub = createStub(implementation, "fill");

        context2d.fill("nonzero");
        t.true(implStub.withArgs("nonzero").calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs("nonzero").calledOnce);
        });
    });
});

describe('stroke', () => {
    test('context calls stroke', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "stroke");
        context2d.stroke();
        t.true(stub.withArgs().calledOnce);
    });

    test('context only calls upgraded stroke if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "stroke");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.stroke();
            t.true(stub.calledOnce);
        });
    });

    test('context calls both versions of stroke when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "stroke");
        const implStub = createStub(implementation, "stroke");

        context2d.stroke();
        t.true(implStub.calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.calledOnce);
        });
    });
});

describe('clip', () => {
    test('context calls clip', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "clip");
        context2d.clip();
        t.true(stub.calledOnce);
    });

    test('context only calls upgraded clip if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "clip");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.clip();
            t.true(stub.calledOnce);
        });
    });

    test('context calls both versions of clip when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "clip");
        const implStub = createStub(implementation, "clip");

        context2d.clip();
        t.true(implStub.calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.calledOnce);
        });
    });
});

describe('isPointInPath', () => {
    test('context calls isPointInPath', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "isPointInPath");
        context2d.isPointInPath(1, 2);
        t.true(stub.withArgs(1, 2).calledOnce);
    });

    test('context only calls upgraded isPointInPath if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "isPointInPath");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.isPointInPath(2, 1);
            t.true(stub.withArgs(2, 1).calledOnce);
        });
    });

    test('context calls both versions of isPointInPath when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "isPointInPath");
        const implStub = createStub(implementation, "isPointInPath");

        context2d.isPointInPath(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('isPointInStroke', () => {
    test('context calls isPointInStroke', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "isPointInStroke");
        context2d.isPointInStroke(1, 2);
        t.true(stub.withArgs(1, 2).calledOnce);
    });

    test('context only calls upgraded isPointInStroke if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "isPointInStroke");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.isPointInStroke(2, 1);
            t.true(stub.withArgs(2, 1).calledOnce);
        });
    });

    test('context calls both versions of isPointInStroke when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "isPointInStroke");
        const implStub = createStub(implementation, "isPointInStroke");

        context2d.isPointInStroke(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('rotate', () => {
    test('context calls rotate', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "rotate");
        context2d.rotate(6);
        t.true(stub.withArgs(6).calledOnce);
    });

    test('context only calls upgraded rotate if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "rotate");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.rotate(12);
            t.true(stub.withArgs(12).calledOnce);
        });
    });

    test('context calls both versions of rotate when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "rotate");
        const implStub = createStub(implementation, "rotate");

        context2d.rotate(21);
        t.true(implStub.withArgs(21).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(21).calledOnce);
        });
    });
});

describe('scale', () => {
    test('context calls scale', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "scale");
        context2d.scale(10, 10);
        t.true(stub.withArgs(10, 10).calledOnce);
    });

    test('context only calls upgraded scale if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "scale");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.scale(12, 12);
            t.true(stub.withArgs(12, 12).calledOnce);
        });
    });

    test('context calls both versions of scale when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "scale");
        const implStub = createStub(implementation, "scale");

        context2d.scale(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('translate', () => {
    test('context calls translate', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "translate");
        context2d.translate(15, 15);
        t.true(stub.withArgs(15, 15).calledOnce);
    });

    test('context only calls upgraded translate if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "translate");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.translate(12, 12);
            t.true(stub.withArgs(12, 12).calledOnce);
        });
    });

    test('context calls both versions of translate when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "translate");
        const implStub = createStub(implementation, "translate");

        context2d.translate(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('transform', () => {
    test('context calls transform', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "transform");
        context2d.transform(1, 2, 3, 4, 5, 6);
        t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
    });

    test('context only calls upgraded transform if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "transform");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.transform(1, 1, 1, 1, 1, 1);
            t.true(stub.withArgs(1, 1, 1, 1, 1, 1).calledOnce);
        });
    });

    test('context calls both versions of transform when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "transform");
        const implStub = createStub(implementation, "transform");

        context2d.transform(0, 1, 0, 1, 0, 1);
        t.true(implStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
        });
    });
});

describe('setTransform', () => {
    test('context calls setTransform', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "setTransform");
        context2d.setTransform(1, 2, 3, 4, 5, 6);
        t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
    });

    test('context only calls upgraded setTransform if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "setTransform");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.setTransform(2, 2, 2, 2, 2, 2);
            t.true(stub.withArgs(2, 2, 2, 2, 2, 2).calledOnce);
        });
    });

    test('context calls both versions of setTransform when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "setTransform");
        const implStub = createStub(implementation, "setTransform");

        context2d.setTransform(0, 1, 0, 1, 0, 1);
        t.true(implStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
        });
    });
});

describe('globalAlpha', () => {
    test('context calls set globalAlpha', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "globalAlpha", spy);
        context2d.globalAlpha = 300;
        t.true(spy.withArgs(300).calledOnce);
    });

    test('context only calls upgraded set globalAlpha if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "globalAlpha", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.globalAlpha = 200;
            t.true(spy.withArgs(200).calledOnce);
        });
    });

    test('context calls both versions of set globalAlpha when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "globalAlpha", instanceSpy);
        createSetterStub(implementation, "globalAlpha", implSpy);

        context2d.globalAlpha = 20;
        t.true(implSpy.withArgs(20).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(20).calledOnce);
        });
    });
});

describe('globalCompositeOperation', () => {
    test('context calls set globalCompositeOperation', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "globalCompositeOperation", spy);
        context2d.globalCompositeOperation = "source-over";
        t.true(spy.withArgs("source-over").calledOnce);
    });

    test('context only calls upgraded set globalCompositeOperation if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "globalCompositeOperation", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.globalCompositeOperation = "source-out";
            t.true(spy.withArgs("source-out").calledOnce);
        });
    });

    test('context calls both versions of set globalCompositeOperation when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "globalCompositeOperation", instanceSpy);
        createSetterStub(implementation, "globalCompositeOperation", implSpy);

        context2d.globalCompositeOperation = "source-in";
        t.true(implSpy.withArgs("source-in").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("source-in").calledOnce);
        });
    });
    
});

describe('drawImage', () => {
    test.skip('context calls drawImage', t => {
        const { context2d, implementation, image } = t.context;
        const stub = createStub(implementation, "drawImage");

        const imageBitmapPromise = createImageBitmap((image as unknown) as ImageBitmapSource, 10, 20, 30, 40);
        imageBitmapPromise.then((imageBitmap) => {
            context2d.drawImage(imageBitmap, 10, 10);
            t.true(stub.withArgs(imageBitmap, 10, 10).calledOnce);
        });
    });
});

describe('createImageData', () => {
    test('context calls createImageData', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "createImageData");
        context2d.createImageData(100, 200);
        t.true(stub.withArgs(100, 200).calledOnce);
    });

    test('context only calls upgraded createImageData if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "createImageData");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.createImageData(200, 100);
            t.true(stub.withArgs(200, 100).calledOnce);
        });
    });

    test('context calls both versions of createImageData when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "createImageData");
        const implStub = createStub(implementation, "createImageData");

        context2d.createImageData(0, 1);
        t.true(implStub.withArgs(0, 1).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1).calledOnce);
        });
    });
});

describe('getImageData', () => {
    test('context calls getImageData', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "getImageData");
        context2d.getImageData(1, 2, 3, 4);
        t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    });

    test('context only calls upgraded getImageData if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "getImageData");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.getImageData(4, 3, 2, 1);
            t.true(stub.withArgs(4, 3, 2, 1).calledOnce);
        });
    });

    test('context calls both versions of getImageData when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "getImageData");
        const implStub = createStub(implementation, "getImageData");

        context2d.getImageData(0, 1, 2, 3);
        t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
        });
    });
});

describe('putImageData', () => {
    test.skip('context calls putImageData', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "putImageData");
        const imageData = new ImageData(10, 10);

        context2d.putImageData(imageData, 10, 10);
        t.true(stub.withArgs(imageData, 10, 10).calledOnce);
    });
});

describe('imageSmoothingEnabled', () => {
    test('context calls set imageSmoothingEnabled', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "imageSmoothingEnabled", spy);
        context2d.imageSmoothingEnabled = true;
        t.true(spy.withArgs(true).calledOnce);
    });

    test('context only calls upgraded set imageSmoothingEnabled if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "imageSmoothingEnabled", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.imageSmoothingEnabled = false;
            t.true(spy.withArgs(false).calledOnce);
        });
    });

    test('context calls both versions of set imageSmoothingEnabled when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "imageSmoothingEnabled", instanceSpy);
        createSetterStub(implementation, "imageSmoothingEnabled", implSpy);

        context2d.imageSmoothingEnabled = true;
        t.true(implSpy.withArgs(true).calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs(true).calledOnce);
        });
    });
});

describe('imageSmoothingQuality', () => {
    test('context calls set imageSmoothingQuality', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "imageSmoothingQuality", spy);
        context2d.imageSmoothingQuality = "high";
        t.true(spy.withArgs("high").calledOnce);
    });

    test('context only calls upgraded set imageSmoothingQuality if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "imageSmoothingQuality", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.imageSmoothingQuality = "medium";
            t.true(spy.withArgs("medium").calledOnce);
        });
    });

    test('context calls both versions of set imageSmoothingQuality when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "imageSmoothingQuality", instanceSpy);
        createSetterStub(implementation, "imageSmoothingQuality", implSpy);

        context2d.imageSmoothingQuality = "low";
        t.true(implSpy.withArgs("low").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("low").calledOnce);
        });
    });
});

describe('save', () => {
    test('context calls save', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "save");
        context2d.save();
        t.true(stub.calledOnce);
    });

    test('context only calls upgraded save if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "save");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.save();
            t.true(stub.calledOnce);
        });
    });

    test('context calls both versions of save when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "save");
        const implStub = createStub(implementation, "save");

        context2d.save();
        t.true(implStub.calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.calledOnce);
        });
    });
});

describe('restore', () => {
    test('context calls restore', t => {
        const { context2d, implementation } = t.context;
        const stub = createStub(implementation, "restore");
        context2d.restore();
        t.true(stub.calledOnce);
    });

    test('context only calls upgraded restore if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const stub = createStub(instance.getContext('2d'), "restore");
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.restore();
            t.true(stub.calledOnce);
        });
    });

    test('context calls both versions of restore when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceStub = createStub(instance.getContext('2d'), "restore");
        const implStub = createStub(implementation, "restore");

        context2d.restore();
        t.true(implStub.calledOnce);
        t.false(instanceStub.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceStub.calledOnce);
        });
    });
});

describe('filter', () => {
    test('context calls set filter', t => {
        const { context2d, implementation } = t.context;
        const spy = sandbox.spy();
        createSetterStub(implementation, "filter", spy);
        context2d.filter = "none";
        t.true(spy.withArgs("none").calledOnce);
    });
    
    test('context only calls upgraded set filter if available', async t => {
        const { context2d, deferredUpgrade } = t.context;

        const instance = new OffscreenCanvas();
        const spy = sandbox.spy();
        createSetterStub(instance.getContext('2d'), "filter", spy);
        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            context2d.filter = "none";
            t.true(spy.withArgs("none").calledOnce);
        });
    });

    test('context calls both versions of set filter when called before upgrade', async t => {
        const { context2d, deferredUpgrade, implementation } = t.context;
        const instance = new OffscreenCanvas();

        const instanceSpy = sandbox.spy();
        const implSpy = sandbox.spy();

        createSetterStub(instance.getContext('2d'), "filter", instanceSpy);
        createSetterStub(implementation, "filter", implSpy);

        context2d.filter = "none";
        t.true(implSpy.withArgs("none").calledOnce);
        t.false(instanceSpy.called);

        const promise = new Promise((res) => {
            deferredUpgrade.resolve(instance);
            res();
        });
        promise.then(() => {
            t.true(instanceSpy.withArgs("none").calledOnce);
        });
    });
});

function createStub(obj: any, method: string) {
    obj[method] = sandbox.stub();
    return obj[method];
}

function createSetterStub(obj: any, property: string, spy: () => {}) {
    obj[property] = "existent";
    sandbox.stub(obj, property).set(spy);
}

function describe(name: string, callback: () => void) {
    return callback();
}

afterEach(t => {
    sandbox.restore();
    sandbox.verify();
});