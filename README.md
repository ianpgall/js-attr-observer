js-attr-observer
===========

Library that attempts to provide cross-browser support for MutationObserver.

First checks for `MutationObserver`, then `WebKitMutationObserver`, then `DOMAttrModified`, and finally the `propertychange` Event.

Maintains no bubbling, so can only be attached and observed on a specific element (no children).

Supports:
---------

 - **ObserveAttrChange**

Use:
----

`ObserveAttrChange(element, attr, callback);`
