js-attr-observer
===========

Library that attempts to provide cross-browser support for MutationObserver.

First checks for <code>MutationObserver</code>, then <code>WebKitMutationObserver</code>, then <code>DOMAttrModified</code>, and finally the <code>propertychange</code> Event.

Maintains no bubbling, so can only be attached and observed on a specific element (no children).

Supports:
---------

 - **ObserveAttrChange**

Use:
----

<code>ObserveAttrChange(element, attr, callback);</code>
