import {
  Aws,
  Construct,
  CustomResource,
  CustomResourceProps,
  Reference,
  Stack,
  ConstructNode,
  IResource,
  CfnResource,
} from '@aws-cdk/core';

interface ICustomResource extends IResource {
  readonly ref: string;
  getAtt(attributeName: string): Reference;
  getAttString(attributeName: string): string;
}

export abstract class BaseCustomResource implements ICustomResource {
  private readonly resource: CustomResource;
  protected readonly properties: { [key: string]: any };

  constructor(scope: Construct, id: string, properties: { [key: string]: any }) {
    this.properties = {
      ...this.getDefaultProperties(),
      ...properties,
      Resource: this.getTargetResource(),
    };

    this.preCreateHook();

    const customResourceProps: CustomResourceProps = {
      serviceToken: 'arn:aws:sns:' + Aws.REGION + ':99999999999:custom-resource',
    };

    this.resource = new CustomResource(scope, id, {
      ...customResourceProps,
      properties: this.properties,
    });
  }

  abstract getTargetResource(): string;

  setResourceType(resourceType: string): void {
    (this.resource.node.defaultChild as CfnResource).addOverride('Type', resourceType);
  }

  /**
   * Overwrite this method in subclasses to perform work prior to the underlying
   * AWS resource being created.
   *
   * For example, you could execute property validations.
   */
  protected preCreateHook(): void {
    // do nothing by default
  }

  protected getDefaultProperties(): { [key: string]: any } {
    return {};
  }

  // Delegate to underlying CustomResource

  get ref(): string {
    return this.resource.ref;
  }

  get stack(): Stack {
    return this.resource.stack;
  }

  get node(): ConstructNode {
    return this.resource.node;
  }

  getAtt(attributeName: string): Reference {
    return this.resource.getAtt(attributeName);
  }

  getAttString(attributeName: string): string {
    return this.resource.getAttString(attributeName);
  }

  toString(): string {
    return this.resource.toString();
  }
}