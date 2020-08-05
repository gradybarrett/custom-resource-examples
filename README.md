# custom-resource-examples

## [basic-extend](./src/basic-extend)

[BaseCustomResource](./basic-extend/base-custom-resource.ts) extends CustomResource.
This limits, to a degree, our ability to push code into BaseCustomResource. As a result
each child class must override the constructor, manage, and then pass properties
to the parent.

## [proxy-like-object](./src/proxy-like-object)

[BaseCustomResource](./proxy-like-object/base-custom-resource.ts) implements CustomResource.
This is a rough attempt at a proxy object and template methods to remove constructors
from the child classes and handle property validations, defaults, and translations using
template methods.
