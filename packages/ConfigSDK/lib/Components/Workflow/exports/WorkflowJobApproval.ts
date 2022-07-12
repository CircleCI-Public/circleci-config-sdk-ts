import {
  WorkflowJobParameters,
  WorkflowJobShape,
} from '../types/WorkflowJob.types';
import { WorkflowJobAbstract } from './WorkflowJobAbstract';

export class WorkflowJobApproval extends WorkflowJobAbstract {
  private _name: string;

  constructor(name: string, parameters?: WorkflowJobParameters) {
    super({ ...parameters, type: 'approval' });

    this._name = name;
  }

  generate(flatten?: boolean): WorkflowJobShape {
    return {
      [this.name]: this.generateContents(flatten),
    };
  }

  get name(): string {
    return this._name;
  }
}
