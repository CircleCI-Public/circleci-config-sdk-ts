import {
  WorkflowJobParameters,
  WorkflowJobShape,
} from '../types/WorkflowJob.types';
import { WorkflowJobAbstract } from './WorkflowJobAbstract';

export class WorkflowJobApproval extends WorkflowJobAbstract {
  name: string;

  constructor(name: string, parameters?: WorkflowJobParameters) {
    super({ ...parameters, type: 'approval' });

    this.name = name;
  }

  generate(): WorkflowJobShape {
    return {
      [this.name]: this.generateContents(),
    };
  }
}
