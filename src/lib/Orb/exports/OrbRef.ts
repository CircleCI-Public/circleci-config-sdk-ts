import { CustomParametersList } from '../../Components/Parameters';
import { AnyParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { GenerableType } from '../../Config/exports/Mapping';
import { OrbImport } from './OrbImport';

export class OrbRef<Literal extends AnyParameterLiteral> {
  private _parameters: CustomParametersList<Literal>;
  private _name: string;
  private _orb: OrbImport;

  constructor(
    name: string,
    parameters: CustomParametersList<Literal>,
    orb: OrbImport,
  ) {
    this._name = name;
    this._parameters = parameters;
    this._orb = orb;
  }

  get generableType(): GenerableType {
    return GenerableType.ORB_REF;
  }

  get name(): string {
    return `${this._orb.alias}/${this._name}`;
  }

  get parameters(): CustomParametersList<Literal> {
    return this._parameters;
  }

  get orb(): OrbImport {
    return this._orb;
  }
}
