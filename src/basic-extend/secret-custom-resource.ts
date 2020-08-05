import { Construct } from '@aws-cdk/core';
import { SecretBaseCustomResource, SecretBaseCustomResourceProps } from './secret-base-custom-resource';
import { defaultsDeep } from 'lodash'

export interface SecretCustomResourceProps extends SecretBaseCustomResourceProps {
  Action: string;
  SecretType?: string;
  BusinessUnitKey?: string;
  OrganizationKey?: string;
  ArtifactKey?: string;
  EnvironmentKey?: string;
  RuntimeInstanceKey?: string;
  ReplaceSecretIfExists?: boolean;
  DBInstanceKey?: string;
  Access?: string;
  RelationshipSecretsOnly?: boolean;
  SecretData?: { [id: string] : { [id: string] : string; }; } | { [id: string]: string[] };
 }

export class SecretCustomResource extends SecretBaseCustomResource {
  constructor(scope: Construct, id: string, props: SecretCustomResourceProps) {
    const { ReplaceSecretIfExists, RelationshipSecretsOnly, ...restOfProps } = props;

    if (props.Action.toLowerCase() === 'get') {
      if (props.SecretData) {
        Object.keys(props.SecretData).forEach(key => {
          if (!Array.isArray(props.SecretData![key])) {
            throw Error(`'SecretData' struct is incorrectly defined for a 'get' Action: '${key}' secret name is not an array of secrets keys to retrieve`);
          }
        })
      }
    } else if (props.Action.toLowerCase() === 'store') {
      if (props.SecretData) {
        Object.keys(props.SecretData).forEach(key => {
          if (typeof props.SecretData![key] !== 'object' || Array.isArray(props.SecretData![key])) {
            throw Error(`'SecretData' struct is incorrectly defined for a 'store' Action: '${key}' secret name is not an object of secret keys and values to store`);
          }
        })
      }
    }

    let properties: SecretBaseCustomResourceProps = defaultsDeep(
      {},
      restOfProps,
      {
        ReplaceSecretIfExists: (props.ReplaceSecretIfExists == null || props.ReplaceSecretIfExists) ?  'Y' : 'N',
        Resource: 'SpecificTargetResource'
      }
    );

    // Only pass this property when true
    if (RelationshipSecretsOnly) {
      properties = defaultsDeep(properties, {RelationshipSecretsOnly: "true"})
    }

    super(scope, id, properties);
  }

  /**
   * Returns the Secret value based on the id passed in.
   * @param id the Id of the secret to get the value for.
   */
  getSecretById(id: string): string {
    return this.getAtt(id).toString();
  }
}
  
