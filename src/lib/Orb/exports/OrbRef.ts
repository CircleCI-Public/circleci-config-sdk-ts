import { Generable } from '../../Components';
import { GenerableType } from '../../Config/exports/Mapping';
import { NamedOrbComponent } from './Components';
import { OrbImportDirective } from './OrbImport';

export class OrbRef<Component extends NamedOrbComponent> implements Generable {
  orb: OrbImportDirective;
  parameters?: Record<string, unknown>;

  private _component: Component;

  constructor(
    orb: OrbImportDirective,
    ref: Component,
    parameters?: Record<string, unknown>,
  ) {
    this.orb = orb;
    this._component = ref;
    this.parameters = parameters;
  }

  generate(): unknown {
    return { [`${this.orb.alias}/${this.component.name}`]: this.parameters };
  }

  get generableType(): GenerableType {
    return GenerableType.ORB_REF;
  }

  get component(): Component {
    return this._component;
  }

  get name(): string {
    return this.component.name;
  }
}
