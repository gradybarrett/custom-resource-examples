import { BaseCustomResource } from './base-custom-resource';

export interface SecretBaseCustomResourceProps {
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
  getDefaultProperties(): { [key: string]: any } {
    return {
      VaultToken: process.env.bamboo_secret_vault_token_token,
      Index: process.env.bamboo_secret__index,
    };
  }
}
