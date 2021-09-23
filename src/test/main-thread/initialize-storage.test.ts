import anyTest, { TestInterface } from 'ava';
import { initialize } from '../../worker-thread/initialize';
import { WorkerStorageInit } from '../../worker-thread/initialize-storage';
import { Document } from '../../worker-thread/dom/Document';
import { HydrateableNode } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  doc: Document;
  self: any;
}>;
test.beforeEach((t) => {
  const doc = { defaultView: {} } as Document;
  const self: any = {};
  (globalThis as any).self = self;
  t.context = { doc, self };
});

test.serial('Should install throwing storage', (t) => {
  const unsupportedAccess: WorkerStorageInit = {
    storage: null,
    errorMsg: 'Access denied',
  };
  const { doc, self } = t.context;
  initialize(doc, [], {} as HydrateableNode, [], [], [0, 0], unsupportedAccess, unsupportedAccess);
  t.falsy(doc.defaultView.localStorage);
  t.falsy(doc.defaultView.sessionStorage);
  t.falsy(self.localStorage);
  t.falsy(self.sessionStorage);
});

test.serial('Should install accessible storage', (t) => {
  const supportedAccess: WorkerStorageInit = {
    storage: {},
    errorMsg: null,
  };
  const { doc } = t.context;
  initialize(doc, [], {} as HydrateableNode, [], [], [0, 0], supportedAccess, supportedAccess);
  t.truthy(doc.defaultView.localStorage);
  t.truthy(doc.defaultView.sessionStorage);
});
