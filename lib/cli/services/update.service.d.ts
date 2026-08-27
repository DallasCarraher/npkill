import { HttpsService } from './https.service.js';
export declare class UpdateService {
  private readonly httpsService;
  constructor(httpsService: HttpsService);
  /**
   * Check if localVersion is greater or equal to remote version
   * ignoring the pre-release tag. ex: 1.3.12 = 1.3.12-21
   */
  isUpdated(localVersion: string): Promise<boolean>;
  private compareVersions;
  private getRemoteVersion;
  private isSameVersion;
  /** Valid to compare versions up to 99999.99999.99999 */
  private isLocalVersionGreater;
}
