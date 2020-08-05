import { Aws, Construct, CustomResource, CustomResourceProps } from '@aws-cdk/core';
import { defaultsDeep } from 'lodash';


export interface BaseCustomResourceProps extends Partial<CustomResourceProps> {}

/**
 * Base custom resource for all custom resources to extend.
 */
export abstract class BaseCustomResource extends CustomResource {
    
  constructor(scope: Construct, id: string, props?: BaseCustomResourceProps) {

    const properties: CustomResourceProps = defaultsDeep({}, props, { 
      properties: {
        serviceToken: "arn:aws:sns:" + Aws.REGION + ":999999999999:custom-resource"
      }
    });
    
    super(scope, id, properties);
  }
}
