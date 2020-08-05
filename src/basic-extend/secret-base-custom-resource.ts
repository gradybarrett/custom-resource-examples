import { Construct } from '@aws-cdk/core';
import { BaseCustomResource, BaseCustomResourceProps } from './base-custom-resource';
import { defaultsDeep } from 'lodash';

/**
 * Essential props to allow integration
 */
export interface SecretBaseCustomResourceProps extends BaseCustomResourceProps {
  /**
   * Details about Token
   * 
   * @default process.env.token_from_environment
   */
  Token?: string;

  /**
   * Details about Index
   * 
   * @default process.env.index_from_environment
   */
  Index?: string;
}

/**
 * Base custom resource for all Custom::Secret resources to extend.
 */
export abstract class SecretBaseCustomResource extends BaseCustomResource {
    
  constructor(scope: Construct, id: string, props: SecretBaseCustomResourceProps) {

    const properties: SecretBaseCustomResourceProps = defaultsDeep({}, props, {
      properties: {
        Token: props.Token || process.env.token_from_environment,
        Index: props.Index || process.env.index_from_environment,
      }
    });

    super(scope, id, properties);
  }
}