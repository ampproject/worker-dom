var MainThread = (function (exports) {
    'use strict';

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
    var count = 0;
    var STRINGS = new Map();
    /**
     * Return a string for the specified index.
     * @param index string index to retrieve.
     * @returns string in map for the index.
     */

    function getString(index) {
      return STRINGS.get(index) || '';
    }
    /**
     * Stores a string for parsing from mutation
     * @param value string to store from background thread.
     */

    function storeString(value) {
      STRINGS.set(++count, value);
    }

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
    var NODES;
    var BASE_ELEMENT;
    function prepare(baseElement) {
      NODES = new Map([[1, baseElement], [2, baseElement]]);
      BASE_ELEMENT = baseElement;
    }
    function isTextNode(node) {
      return ('nodeType' in node ? node.nodeType : node[0
      /* nodeType */
      ]) === 3
      /* TEXT_NODE */
      ;
    }
    /**
     * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
     * @example <caption>Text node</caption>
     *   createNode({ nodeType:3, data:'foo' })
     * @example <caption>Element node</caption>
     *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
     */

    function createNode(skeleton) {
      if (isTextNode(skeleton)) {
        var _node = document.createTextNode(getString(skeleton[5
        /* textContent */
        ]));

        storeNode(_node, skeleton[7
        /* _index_ */
        ]);
        return _node;
      }

      var namespace = skeleton[6
      /* namespaceURI */
      ] !== undefined ? getString(skeleton[6
      /* namespaceURI */
      ]) : undefined;
      var node = namespace ? document.createElementNS(namespace, getString(skeleton[1
      /* nodeName */
      ])) : document.createElement(getString(skeleton[1
      /* nodeName */
      ])); // TODO(KB): Restore Properties
      // skeleton.properties.forEach(property => {
      //   node[`${property.name}`] = property.value;
      // });
      // ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(childNode => {
      //   if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
      //     node.appendChild(createNode(childNode as TransferrableNode));
      //   }
      // });

      storeNode(node, skeleton[7
      /* _index_ */
      ]);
      return node;
    }
    /**
     * Returns the real DOM Element corresponding to a serialized Element object.
     * @param id
     * @return
     */

    function getNode(id) {
      var node = NODES.get(id);

      if (node && node.nodeName === 'BODY') {
        // If the node requested is the "BODY"
        // Then we return the base node this specific <amp-script> comes from.
        // This encapsulates each <amp-script> node.
        return BASE_ELEMENT;
      }

      return node;
    }
    /**
     * Establish link between DOM `node` and worker-generated identifier `id`.
     *
     * These _shouldn't_ collide between instances of <amp-script> since
     * each element creates it's own pool on both sides of the worker
     * communication bridge.
     * @param node
     * @param id
     */

    function storeNode(node, id) {
      node._index_ = id;
      NODES.set(id, node);
    }

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
    // TODO(KB): Fetch Polyfill for IE11.
    function createWorker(workerDomURL, authorScriptURL) {
      return Promise.all([fetch(workerDomURL).then(function (response) {
        return response.text();
      }), fetch(authorScriptURL).then(function (response) {
        return response.text();
      })]).then(function (_ref) {
        var workerScript = _ref[0],
            authorScript = _ref[1];
        // TODO(KB): Minify this output during build process.
        var keys = [];

        for (var key in document.body.style) {
          keys.push("'" + key + "'");
        }

        var code = "\n        'use strict';\n        " + workerScript + "\n        (function() {\n          var self = this;\n          var window = this;\n          var document = this.document;\n          var localStorage = this.localStorage;\n          var location = this.location;\n          var defaultView = document.defaultView;\n          var Node = defaultView.Node;\n          var Text = defaultView.Text;\n          var Element = defaultView.Element;\n          var SVGElement = defaultView.SVGElement;\n          var Document = defaultView.Document;\n          var Event = defaultView.Event;\n          var MutationObserver = defaultView.MutationObserver;\n\n          function addEventListener(type, handler) {\n            return document.addEventListener(type, handler);\n          }\n          function removeEventListener(type, handler) {\n            return document.removeEventListener(type, handler);\n          }\n          this.appendKeys([" + keys + "]);\n          " + authorScript + "\n        }).call(WorkerThread.workerDOM);\n//# sourceURL=" + encodeURI(authorScriptURL);
        return new Worker(URL.createObjectURL(new Blob([code])));
      }).catch(function (error) {
        return null;
      });
    }
    function messageToWorker(worker, message) {
      worker.postMessage(message);
    }

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
    var KNOWN_LISTENERS = [];
    /**
     * Instead of a whitelist of elements that need their value tracked, use the existence
     * of a property called value to drive the decision.
     * @param node node to check if values should be tracked.
     * @return boolean if the node should have its value property tracked.
     */

    var shouldTrackChanges = function shouldTrackChanges(node) {
      return node && 'value' in node;
    };
    /**
     * When a node that has a value needing synced doesn't already have an event listener
     * listening for changed values, ensure the value is synced with a default listener.
     * @param worker whom to dispatch value toward.
     * @param node node to listen to value changes on.
     */


    var applyDefaultChangeListener = function applyDefaultChangeListener(worker, node) {
      shouldTrackChanges(node) && node.onchange === null && (node.onchange = function () {
        return fireValueChange(worker, node);
      });
    };
    /**
     * Tell the worker DOM what the value is for a Node.
     * @param worker whom to dispatch value toward.
     * @param node where to get the value from.
     */

    var fireValueChange = function fireValueChange(worker, node) {
      var _, _messageToWorker;

      messageToWorker(worker, (_messageToWorker = {}, _messageToWorker[9
      /* type */
      ] = 5, _messageToWorker[38
      /* sync */
      ] = (_ = {}, _[7
      /* _index_ */
      ] = node._index_, _[18
      /* value */
      ] = node.value, _), _messageToWorker));
    };
    /**
     * Register an event handler for dispatching events to worker thread
     * @param worker whom to dispatch events toward
     * @param _index_ node index the event comes from (used to dispatchEvent in worker thread).
     * @return eventHandler function consuming event and dispatching to worker thread
     */


    var eventHandler = function eventHandler(worker, _index_) {
      return function (event) {
        var _2, _3, _4, _messageToWorker2;

        if (shouldTrackChanges(event.currentTarget)) {
          fireValueChange(worker, event.currentTarget);
        }

        messageToWorker(worker, (_messageToWorker2 = {}, _messageToWorker2[9
        /* type */
        ] = 1, _messageToWorker2[37
        /* event */
        ] = (_4 = {}, _4[7
        /* _index_ */
        ] = _index_, _4[22
        /* bubbles */
        ] = event.bubbles, _4[23
        /* cancelable */
        ] = event.cancelable, _4[24
        /* cancelBubble */
        ] = event.cancelBubble, _4[25
        /* currentTarget */
        ] = (_2 = {}, _2[7
        /* _index_ */
        ] = event.currentTarget._index_, _2[8
        /* transferred */
        ] = 1, _2), _4[26
        /* defaultPrevented */
        ] = event.defaultPrevented, _4[27
        /* eventPhase */
        ] = event.eventPhase, _4[28
        /* isTrusted */
        ] = event.isTrusted, _4[29
        /* returnValue */
        ] = event.returnValue, _4[10
        /* target */
        ] = (_3 = {}, _3[7
        /* _index_ */
        ] = event.target._index_, _3[8
        /* transferred */
        ] = 1, _3), _4[30
        /* timeStamp */
        ] = event.timeStamp, _4[9
        /* type */
        ] = event.type, _4[32
        /* keyCode */
        ] = 'keyCode' in event ? event.keyCode : undefined, _4), _messageToWorker2));
      };
    };
    /**
     * Process commands transfered from worker thread to main thread.
     * @param nodesInstance nodes instance to execute commands against.
     * @param worker whom to dispatch events toward.
     * @param mutation mutation record containing commands to execute.
     */


    function process(worker, mutation) {
      var _index_ = mutation[10
      /* target */
      ];
      var target = getNode(_index_);
      (mutation[21
      /* removedEvents */
      ] || []).forEach(function (eventSub) {
        processListenerChange(worker, target, false, getString(eventSub[9
        /* type */
        ]), eventSub[33
        /* index */
        ]);
      });
      (mutation[20
      /* addedEvents */
      ] || []).forEach(function (eventSub) {
        processListenerChange(worker, target, true, getString(eventSub[9
        /* type */
        ]), eventSub[33
        /* index */
        ]);
      });
    }
    /**
     * If the worker requests to add an event listener to 'change' for something the foreground thread is already listening to
     * ensure that only a single 'change' event is attached to prevent sending values multiple times.
     * @param worker worker issuing listener changes
     * @param target node to change listeners on
     * @param addEvent is this an 'addEvent' or 'removeEvent' change
     * @param type event type requested to change
     * @param index number in the listeners array this event corresponds to.
     */

    function processListenerChange(worker, target, addEvent, type, index) {
      var changeEventSubscribed = target.onchange !== null;
      var shouldTrack = shouldTrackChanges(target);
      var isChangeEvent = type === 'change';

      if (addEvent) {
        if (isChangeEvent) {
          changeEventSubscribed = true;
          target.onchange = null;
        }

        target.addEventListener(type, KNOWN_LISTENERS[index] = eventHandler(worker, target._index_));
      } else {
        if (isChangeEvent) {
          changeEventSubscribed = false;
        }

        target.removeEventListener(type, KNOWN_LISTENERS[index]);
      }

      if (shouldTrack && !changeEventSubscribed) {
        applyDefaultChangeListener(worker, target);
      }
    }

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

    function allTextNodes(nodes) {
      return nodes.length > 0 && [].every.call(nodes, isTextNode);
    }
    /**
     * Replace all the children with the ones from the HydrateableNode.
     * Used when we're certain the content won't break the page.
     * @param nodes HydrateableNodes containing content to potentially overwrite main thread content.
     * @param parent Node in the main thread that will be the parent of the passed nodes.
     * @param worker worker that issued the request for hydration.
     */


    function replaceNodes(nodes, parent, worker) {
      [].forEach.call(parent.childNodes, function (childNode) {
        return childNode.remove();
      });
      nodes.forEach(function (node, index) {
        var newNode = createNode(node);
        (node[2
        /* attributes */
        ] || []).forEach(function (attribute) {
          var namespaceURI = getString(attribute[0]);

          if (namespaceURI !== 'null') {
            newNode.setAttributeNS(namespaceURI, getString(attribute[1]), getString(attribute[2]));
          } else {
            newNode.setAttribute(getString(attribute[1]), getString(attribute[2]));
          }
        });
        parent.appendChild(newNode);
        applyDefaultChangeListener(worker, newNode);
        replaceNodes(node[4
        /* childNodes */
        ] || [], parent.childNodes[index], worker);
      });
    }
    /**
     * Hydrate a single node and it's children safely.
     * Attempt to ensure content is a rough match so content doesn't shift between the document representation
     * and client side generated content.
     * @param transferNode root of the background thread content (document.body from worker-thread).
     * @param node root for the foreground thread content (element upgraded to background driven).
     * @param worker worker that issued the request for hydration.
     */


    function hydrateNode(transferNode, node, worker) {
      var transferIsText = isTextNode(transferNode);
      var nodeIsText = isTextNode(node);

      if (!transferIsText && !nodeIsText) {
        var childNodes = transferNode[4
        /* childNodes */
        ] || [];

        if (childNodes.length !== node.childNodes.length) {
          // If this parent node has an unequal number of childNodes, we need to ensure its for an allowable reason.
          if (allTextNodes(childNodes) && allTextNodes(node.childNodes)) {
            // Offset due to a differing number of text nodes.
            // replace the current DOM with the text nodes from the hydration.
            replaceNodes(childNodes, node, worker);
          } else {
            var filteredTransfer = childNodes.filter(function (childNode) {
              return !isTextNode(childNode);
            });
            var filteredNodes = [].filter.call(node.childNodes, function (childNode) {
              return !isTextNode(childNode);
            }); // Empty text nodes are used by frameworks as placeholders for future dom content.

            if (filteredTransfer.length === filteredNodes.length) {
              storeNode(node, transferNode[7
              /* _index_ */
              ]);
              replaceNodes(childNodes, node, worker);
            }
          }
        } else {
          storeNode(node, transferNode[7
          /* _index_ */
          ]);
          applyDefaultChangeListener(worker, node); // Same number of children, hydrate them.

          childNodes.forEach(function (childNode, index) {
            return hydrateNode(childNode, node.childNodes[index], worker);
          });
        }
      } else if (transferIsText && nodeIsText) {
        // Singular text node, no children.
        storeNode(node, transferNode[7
        /* _index_ */
        ]);
        node.textContent = getString(transferNode[5
        /* textContent */
        ]);
        applyDefaultChangeListener(worker, node);
      }
    }
    /**
     * Hydrate a root from the worker thread by comparing with the main thread representation.
     * @param skeleton root of the background thread content.
     * @param addEvents events needing subscription from the background thread content.
     * @param baseElement root of the main thread content to compare against.
     * @param worker worker issuing the upgrade request.
     */


    function hydrate(skeleton, stringValues, addEvents, baseElement, worker) {
      // Process String Additions
      stringValues.forEach(function (value) {
        return storeString(value);
      }); // Process Node Addition / Removal

      hydrateNode(skeleton, baseElement, worker); // Process Event Addition

      addEvents.forEach(function (event) {
        var node = getNode(event[7
        /* _index_ */
        ]);
        node && processListenerChange(worker, node, true, getString(event[9
        /* type */
        ]), event[33
        /* index */
        ]);
      });
    }

    var _mutators;
    var MUTATION_QUEUE = [];
    var PENDING_MUTATIONS = false;
    var worker;
    function prepareMutate(passedWorker) {
      worker = passedWorker;
    }
    var mutators = (_mutators = {}, _mutators[2
    /* CHILD_LIST */
    ] = function _(mutation, target, sanitizer) {
      (mutation[12
      /* removedNodes */
      ] || []).forEach(function (node) {
        return getNode(node[7
        /* _index_ */
        ]).remove();
      });
      var addedNodes = mutation[11
      /* addedNodes */
      ];
      var nextSibling = mutation[14
      /* nextSibling */
      ];

      if (addedNodes) {
        addedNodes.forEach(function (node) {
          var newChild = getNode(node[7
          /* _index_ */
          ]);

          if (!newChild) {
            newChild = createNode(node);

            if (sanitizer) {
              sanitizer.sanitize(newChild); // TODO(choumx): Inform worker?
            }
          }

          target.insertBefore(newChild, nextSibling && getNode(nextSibling[7
          /* _index_ */
          ]) || null);
        });
      }
    }, _mutators[0
    /* ATTRIBUTES */
    ] = function _(mutation, target, sanitizer) {
      var attributeName = mutation[15
      /* attributeName */
      ] !== undefined ? getString(mutation[15
      /* attributeName */
      ]) : null;
      var value = mutation[18
      /* value */
      ] !== undefined ? getString(mutation[18
      /* value */
      ]) : null;

      if (attributeName != null && value != null) {
        if (!sanitizer || sanitizer.validAttribute(target.nodeName, attributeName, value)) {
          target.setAttribute(attributeName, value);
        }
      }
    }, _mutators[1
    /* CHARACTER_DATA */
    ] = function _(mutation, target) {
      var value = mutation[18
      /* value */
      ];

      if (value) {
        // Sanitization not necessary for textContent.
        target.textContent = getString(value);
      }
    }, _mutators[3
    /* PROPERTIES */
    ] = function _(mutation, target, sanitizer) {
      var propertyName = mutation[17
      /* propertyName */
      ] !== undefined ? getString(mutation[17
      /* propertyName */
      ]) : null;
      var value = mutation[18
      /* value */
      ] !== undefined ? getString(mutation[18
      /* value */
      ]) : null;

      if (propertyName && value) {
        if (!sanitizer || sanitizer.validProperty(target.nodeName, propertyName, value)) {
          target[propertyName] = value;
        }
      }
    }, _mutators[4
    /* COMMAND */
    ] = function _(mutation) {
      process(worker, mutation);
    }, _mutators);
    /**
     * Process MutationRecords from worker thread applying changes to the existing DOM.
     * @param nodes New nodes to add in the main thread with the incoming mutations.
     * @param mutations Changes to apply in both graph shape and content of Elements.
     * @param sanitizer Sanitizer to apply to content if needed.
     */

    function mutate(nodes, stringValues, mutations, sanitizer) {
      //mutations: TransferrableMutationRecord[]): void {
      // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
      // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
      //   return;
      // }
      // this.lastGestureTime = lastGestureTime;
      stringValues.forEach(function (value) {
        return storeString(value);
      });
      nodes.forEach(function (node) {
        return createNode(node);
      });
      MUTATION_QUEUE = MUTATION_QUEUE.concat(mutations);

      if (!PENDING_MUTATIONS) {
        PENDING_MUTATIONS = true;
        requestAnimationFrame(function () {
          return syncFlush(sanitizer);
        });
      }
    }
    /**
     * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
     * mutations to apply in a single frame.
     *
     * Investigations in using asyncFlush to resolve are worth considering.
     */

    function syncFlush(sanitizer) {
      MUTATION_QUEUE.forEach(function (mutation) {
        mutators[mutation[9
        /* type */
        ]](mutation, getNode(mutation[10
        /* target */
        ]), sanitizer);
      });
      MUTATION_QUEUE = [];
      PENDING_MUTATIONS = false;
    }

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
    function install(baseElement, workerDOMUrl, sanitizer) {
      var authorURL = baseElement.getAttribute('src');

      if (authorURL === null) {
        return;
      }

      createWorker(workerDOMUrl, authorURL).then(function (worker) {
        if (worker === null) {
          return;
        }

        prepare(baseElement);
        prepareMutate(worker);

        worker.onmessage = function (_ref) {
          var data = _ref.data;

          switch (data[9
          /* type */
          ]) {
            case 2
            /* HYDRATE */
            :
              // console.info(`hydration from worker: ${data.type}`, data);
              hydrate(data[35
              /* nodes */
              ], data[39
              /* strings */
              ], data[20
              /* addedEvents */
              ], baseElement, worker);
              break;

            case 3
            /* MUTATE */
            :
              // console.info(`mutation from worker: ${data.type}`, data);
              mutate(data[35
              /* nodes */
              ], data[39
              /* strings */
              ], data[34
              /* mutations */
              ], sanitizer);
              break;
          }
        };
      });
    }

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
    function upgradeElement(baseElement, workerDOMUrl) {
      install(baseElement, workerDOMUrl);
    }

    exports.upgradeElement = upgradeElement;

    return exports;

}({}));
//# sourceMappingURL=index.js.map
