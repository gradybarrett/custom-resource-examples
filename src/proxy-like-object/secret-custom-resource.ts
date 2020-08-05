import { Construct } from '@aws-cdk/core';
import { SecretBaseCustomResource, SecretBaseCustomResourceProps } from './secret-base-custom-resource';

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
  SecretData?: { [id: string]: { [id: string]: string } } | { [id: string]: string[] };
}

export class SecretCustomResource extends SecretBaseCustomResource {
  /**
   * Custom Resource Resource property - used to distinguish target resource/operation when
   * picking messages from the queue
   */
  getTargetResource(): string {
    return 'SpecificTargetResource';
  }

  getDefaultProperties(): { [key: string]: any } {
    return {
      ...super.getDefaultProperties(),
      ReplaceSecretIfExists: 'Y',
    };
  }

  protected preCreateHook(): void {
    super.preCreateHook()

    if (this.properties.Action.toLowerCase() === 'get') {
      if (this.properties.SecretData) {
        Object.keys(this.properties.SecretData).forEach((key) => {
          if (!Array.isArray(this.properties.SecretData![key])) {
            throw Error(
              `'SecretData' struct is incorrectly defined for a 'get' Action: '${key}' secret name is not an array of secrets keys to retrieve`,
            );
          }
        });
      }
    } else if (this.properties.Action.toLowerCase() === 'store') {
      if (this.properties.SecretData) {
        Object.keys(this.properties.SecretData).forEach((key) => {
          if (typeof this.properties.SecretData![key] !== 'object' || Array.isArray(this.properties.SecretData![key])) {
            throw Error(
              `'SecretData' struct is incorrectly defined for a 'store' Action: '${key}' secret name is not an object of secret keys and values to store`,
            );
          }
        });
      }
    }

    const replaceSecretIfExists: any = this.properties.ReplaceSecretIfExists

    if (replaceSecretIfExists != null) {
      this.properties.ReplaceSecretIfExists = this.translateBooleanToYN(replaceSecretIfExists);
    }

    // Only pass this properties if it's true
    if (!this.properties.RelationshipSecretsOnly) {
      delete this.properties.RelationshipSecretsOnly;
    }
  }

  /**
   * Returns the Secret value based on the id passed in.
   * @param id the Id of the secret to get the value for.
   */
  getSecretById(id: string): string {
    return this.getAtt(id).toString();
  }

  private translateBooleanToYN(bool?: boolean): 'Y' | 'N' {
    return bool ? 'Y' : 'N';
  }
}