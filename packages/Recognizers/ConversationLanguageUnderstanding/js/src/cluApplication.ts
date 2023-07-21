// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export class CluApplication {
  constructor(
    public projectName: string,
    public endpointKey: string,
    public endpoint: string,
    public deploymentName: string
  ) {
    if (!projectName?.trim()) {
      throw new Error(`CLU "projectName" parameter cannot be null or empty.`);
    }

    if (!endpointKey?.trim()) {
      // TODO: Implement this => (!Guid.TryParse(endpointKey, out var _))
      throw new Error(`"${endpointKey}" is not a valid CLU subscription key.`);
    }

    if (!endpoint?.trim()) {
      throw new Error(`CLU "endpoint" parameter cannot be null or empty.`);
    }

    if (!endpoint?.trim()) {
      // TODO: Implement this => (!Uri.IsWellFormedUriString(endpoint, UriKind.Absolute))
      throw new Error(`"${endpoint}" is not a valid CLU endpoint.`);
    }

    if (!deploymentName?.trim()) {
      throw new Error(
        `CLU "deploymentName" parameter cannot be null or empty.`
      );
    }
  }
}
