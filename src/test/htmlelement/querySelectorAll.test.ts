import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { toLower } from '../../utils';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';
const FAKE_ATTR = 'FAKE_ATTR';
const FAKE_ATTR_VALUE = 'FAKE_ATTR_VALUE';

const test = anyTest as TestInterface<{
  document: Document;
  parentDiv: Element;
  div: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const parentDiv = document.createElement('div');
  const div = document.createElement('div');
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  div.setAttribute(FAKE_ATTR, FAKE_ATTR_VALUE);
  parentDiv.setAttribute(FAKE_ATTR, FAKE_ATTR_VALUE);
  parentDiv.appendChild(div);
  document.body.appendChild(parentDiv);

  t.context = {
    document,
    parentDiv,
    div,
  };
});

test('test Element.querySelectorAll on id selectors', (t) => {
  const { document, div } = t.context;

  t.deepEqual(document.querySelectorAll(`#${DIV_ID}`), [div]);
});

// TODO: create better solution for parameterizing server tests.
test.serial('server=true: test Element.querySelectorAll on id selectors', (t) => {
  process.env.SERVER = 'true';
  try {
    const document = createTestingDocument();
    const testEl = document.createElement('test-el');
    testEl.setAttribute('id', 'TEST_EL_ID');
    document.appendChild(testEl);

    const result = document.querySelectorAll('#TEST_EL_ID');
    t.deepEqual(result, [testEl]);
  } finally {
    delete process.env.SERVER;
  }
});

test('test Element.querySelectorAll on class selectors', (t) => {
  const { document, div } = t.context;

  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}`), [div]);
});

test('test Element.querySelectorAll on tag selectors', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelectorAll('div'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('div'), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr]', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr=value]', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}=${FAKE_ATTR_VALUE}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}=${FAKE_ATTR_VALUE}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr=value i]', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);

  div.setAttribute(FAKE_ATTR, `fake_attr_value`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}=${FAKE_ATTR_VALUE} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}=${FAKE_ATTR_VALUE} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}=${FAKE_ATTR_VALUE} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}=${FAKE_ATTR_VALUE} i]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr~=value]', (t) => {
  const { document, parentDiv, div } = t.context;

  const otherDiv = document.createElement('div');
  parentDiv.appendChild(otherDiv);
  div.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  otherDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}1`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}~=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}~=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}~=${FAKE_ATTR_VALUE}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}~=${FAKE_ATTR_VALUE}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr~=value i]', (t) => {
  const { document, parentDiv, div } = t.context;

  const otherDiv = document.createElement('div');
  parentDiv.appendChild(otherDiv);
  div.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  otherDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}1`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);

  div.setAttribute(FAKE_ATTR, `${toLower(FAKE_ATTR_VALUE)} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}`);
  otherDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}1`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}~=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr^=value]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}^=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}^=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}^=${FAKE_ATTR_VALUE}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}^=${FAKE_ATTR_VALUE}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr^=value i]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `${FAKE_ATTR_VALUE} JUST_ANOTHER_FAKE`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);

  div.setAttribute(FAKE_ATTR, `${toLower(FAKE_ATTR_VALUE)} JUST_ANOTHER_FAKE`);
  parentDiv.setAttribute(FAKE_ATTR, `${toLower(FAKE_ATTR_VALUE)} JUST_ANOTHER_FAKE`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}^=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr$=value]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}$=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}$=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}$=${FAKE_ATTR_VALUE}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}$=${FAKE_ATTR_VALUE}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr$=value i]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}$=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr*=value]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}*=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}*=${FAKE_ATTR_VALUE}]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}*=${FAKE_ATTR_VALUE}]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}*=${FAKE_ATTR_VALUE}]`), [div]);
});

test('test Element.querySelectorAll on attr selectors [attr*=value i]', (t) => {
  const { document, parentDiv, div } = t.context;

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${FAKE_ATTR_VALUE}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);

  div.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}`);
  parentDiv.setAttribute(FAKE_ATTR, `JUST_ANOTHER_FAKE ${toLower(FAKE_ATTR_VALUE)}`);
  t.deepEqual(document.querySelectorAll(`[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`div[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [parentDiv, div]);
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}[${FAKE_ATTR}*=${toLower(FAKE_ATTR_VALUE)} i]`), [div]);
});

test('test Element.querySelectorAll is case insensitive with regards to tags', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelectorAll('div'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('div'), [div]);
  t.deepEqual(document.querySelectorAll('DIV'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('DIV'), [div]);

  t.deepEqual(document.querySelectorAll('div'), document.querySelectorAll('DIV'));
  t.deepEqual(parentDiv.querySelectorAll('div'), parentDiv.querySelectorAll('DIV'));
});

test('test Element.querySelector returns the first result of Element.querySelectorAll', (t) => {
  const { document, parentDiv } = t.context;

  let querySelectorAllResults = document.querySelectorAll('div');
  t.not(querySelectorAllResults, null);
  if (querySelectorAllResults) {
    t.deepEqual(querySelectorAllResults[0], document.querySelector('div'));
  }

  querySelectorAllResults = parentDiv.querySelectorAll('div');
  t.not(querySelectorAllResults, null);
  if (querySelectorAllResults) {
    t.deepEqual(querySelectorAllResults[0], parentDiv.querySelector('div'));
  }

  querySelectorAllResults = document.querySelectorAll('DIV');
  t.not(querySelectorAllResults, null);
  if (querySelectorAllResults) {
    t.deepEqual(querySelectorAllResults[0], document.querySelector('DIV'));
  }

  querySelectorAllResults = parentDiv.querySelectorAll('DIV');
  t.not(querySelectorAllResults, null);
  if (querySelectorAllResults) {
    t.deepEqual(querySelectorAllResults[0], parentDiv.querySelector('DIV'));
  }
});
