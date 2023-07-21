// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Activity, RecognizerResult } from 'botbuilder';
import { ConnectorClient } from 'botframework-connector';
import { DialogContext, Recognizer } from 'botbuilder-dialogs';
import { BoolExpression, StringExpression } from 'adaptive-expressions';
import { CluConstants } from '../cluConstants';
import { CluMainRecognizer } from './cluMainRecognizer';
import { CluRecognizerOptions } from '../cluRecognizerOptions';
import { CluApplication } from '../cluApplication';
import { DefaultHttpClient } from '@azure/ms-rest-js';
import { DefaultHttpClientFactory } from '../defaultHttpClientFactory';

export class CluAdaptiveRecognizer extends Recognizer {
  public static readonly $kind: string = 'Microsoft.CluRecognizer';
  public projectName: StringExpression = new StringExpression();
  public endpoint: StringExpression = new StringExpression();
  public endpointKey: StringExpression = new StringExpression();
  public deploymentName: StringExpression = new StringExpression();
  public logPersonalInformation: BoolExpression = new BoolExpression(
    '=settings.runtimeSettings.telemetry.logPersonalInformation'
  );
  public includeAPIResults: BoolExpression = new BoolExpression();
  public cluRequestBodyStringIndexType: StringExpression = new StringExpression(
    CluConstants.RequestOptions.StringIndexType
  );
  public cluApiVersion: StringExpression = new StringExpression(
    CluConstants.RequestOptions.ApiVersion
  );

  async recognize(
    dialogContext: DialogContext,
    activity: Activity,
    telemetryProperties?: Record<string, string>,
    telemetryMetrics?: Record<string, number>
  ): Promise<RecognizerResult> {
    const recognizer = new CluMainRecognizer(
      this.recognizerOptions(dialogContext),
      new DefaultHttpClientFactory(dialogContext.context).create()
    );
    const result = await recognizer.recognize(dialogContext, activity);
    this.trackRecognizerResult(
      dialogContext,
      CluConstants.TrackEventOptions.RecognizerResultEventName,
      this.fillRecognizerResultTelemetryProperties(
        result,
        telemetryProperties ?? {},
        dialogContext
      ),
      telemetryMetrics
    );
    return result;
  }

  recognizerOptions(dialogContext: DialogContext): CluRecognizerOptions {
    const application = new CluApplication(
      this.projectName.getValue(dialogContext.state),
      this.endpointKey.getValue(dialogContext.state),
      this.endpoint.getValue(dialogContext.state),
      this.deploymentName.getValue(dialogContext.state)
    );

    return new CluRecognizerOptions(application, {
      telemetryClient: this.telemetryClient,
      logPersonalInformation: this.logPersonalInformation.getValue(
        dialogContext.state
      ),
      includeAPIResults: this.includeAPIResults.getValue(dialogContext.state),
      cluRequestBodyStringIndexType: this.cluRequestBodyStringIndexType.getValue(
        dialogContext.state
      ),
      cluApiVersion: this.cluApiVersion.getValue(dialogContext.state),
    });
  }
}
